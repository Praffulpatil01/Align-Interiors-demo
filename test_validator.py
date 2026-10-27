import os
import sys
import re
import json
import html
from html.parser import HTMLParser

def safe_print(msg):
    try:
        print(msg)
    except UnicodeEncodeError:
        print(msg.encode('ascii', 'replace').decode('ascii'))

class SiteValidator(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.links = []
        self.images = []
        self.scripts = []
        self.stylesheets = []
        self.h1_count = 0
        self.title = None
        self.meta_desc = None
        self.json_ld = []
        self._in_title = False
        self._in_script = False
        self._script_type = ''
        self._script_content = ''

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == 'h1':
            self.h1_count += 1
        elif tag == 'title':
            self._in_title = True
        elif tag == 'meta' and attr_dict.get('name') == 'description':
            self.meta_desc = attr_dict.get('content')
        elif tag == 'a' and 'href' in attr_dict:
            self.links.append(attr_dict['href'])
        elif tag == 'img':
            if 'src' in attr_dict: self.images.append(attr_dict['src'])
            if 'data-fallback' in attr_dict: self.images.append(attr_dict['data-fallback'])
        elif tag == 'script':
            self._in_script = True
            self._script_type = attr_dict.get('type', '')
            self._script_content = ''
            if 'src' in attr_dict: self.scripts.append(attr_dict['src'])
        elif tag == 'link' and attr_dict.get('rel') == 'stylesheet' and 'href' in attr_dict:
            self.stylesheets.append(attr_dict['href'])

    def handle_endtag(self, tag):
        if tag == 'title':
            self._in_title = False
        elif tag == 'script':
            self._in_script = False
            if 'application/ld+json' in self._script_type and self._script_content.strip():
                try:
                    self.json_ld.append(json.loads(self._script_content.strip()))
                except Exception as e:
                    safe_print(f"JSON-LD parse error in {self.filename}: {e}")

    def handle_data(self, data):
        if self._in_title:
            self.title = data
        if self._in_script:
            self._script_content += data

files = ['index.html', 'projects.html', 'about.html', 'contact.html', '404.html']
safe_print("=== ALIGN INTERIORS SITE INTEGRITY VERIFICATION ===\n")

all_ok = True
for f in files:
    if not os.path.exists(f):
        safe_print(f"[FAIL] File missing: {f}")
        all_ok = False
        continue
        
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
        
    val = SiteValidator(f)
    val.feed(content)
    
    safe_print(f"File: {f}")
    safe_print(f"  - Title: {val.title}")
    safe_print(f"  - Meta Description: {val.meta_desc}")
    safe_print(f"  - H1 count: {val.h1_count}")
    if val.json_ld:
        safe_print(f"  - JSON-LD Structured Data: Found {len(val.json_ld)} schema block(s)")
        for s in val.json_ld:
            stype = s.get('@type')
            sname = s.get('name')
            safe_print(f"    * Schema Type: {stype} | Name: {sname}")
            
    # Check Stylesheets
    for css in val.stylesheets:
        if not css.startswith('http'):
            clean_css = css.split('?')[0].split('#')[0]
            if os.path.exists(clean_css):
                safe_print(f"  - [PASS] CSS exists: {clean_css}")
            else:
                safe_print(f"  - [FAIL] CSS missing: {clean_css}")
                all_ok = False
                
    # Check Scripts
    for js in val.scripts:
        if not js.startswith('http'):
            clean_js = js.split('?')[0].split('#')[0]
            if os.path.exists(clean_js):
                safe_print(f"  - [PASS] JS exists: {clean_js}")
            else:
                safe_print(f"  - [FAIL] JS missing: {clean_js}")
                all_ok = False

    # Check Images
    for img in val.images:
        if not img.startswith('http') and not img.startswith('data:') and img != '':
            clean_img = img.split('?')[0].split('#')[0]
            if os.path.exists(clean_img):
                safe_print(f"  - [PASS] Image exists: {clean_img} ({os.path.getsize(clean_img)} bytes)")
            else:
                safe_print(f"  - [FAIL] Image missing: {clean_img}")
                all_ok = False

safe_print("\n=== CRITICAL BUSINESS CONTENT VERIFICATION ===")
with open('index.html', 'r', encoding='utf-8') as fh:
    raw_content = fh.read()
    idx_content = html.unescape(raw_content)

checks = [
    ('Phone number tel link', 'tel:+919766045538'),
    ('WhatsApp prefilled link', 'https://wa.me/919766045538'),
    ('Instagram link', 'https://www.instagram.com/aligninteriorsbyrakesh/'),
    ('YouTube link', 'https://www.youtube.com/@aligninteriorsbyrakeshdashpute'),
    ('Verified Google Maps CID link', 'https://www.google.com/maps?cid=3964990284371836881'),
    ('Verified Google Maps CID embed', 'https://maps.google.com/maps?cid=3964990284371836881'),
    ('Address', 'Estonia Office No. 504-B'),
    ('Diya Hawaldar review', 'The design turned out exactly as we had imagined... truly a dream come true.'),
    ('Vivek Surushe review', 'The designs came out just as we imagined, the quality is excellent, and everything was completed on time.'),
    ('Mansi Gyanchandani review', 'Their team\'s creativity, attention to detail, and professionalism were top-notch.'),
    ('Amit Gabada review', 'Our home is beautifully designed the way we wanted.'),
    ('Roshan Moily review', 'One of the best interior designers I have come across. He delivered his work on time.'),
    ('Rajesh More review', 'Align Interior has transformed our 3 BHK Flat into a dream house.'),
    ('Prashant Tathe review', 'They provide you updates on a frequent basis and help you choose the right design.'),
    ('Tagline', 'Thoughtfully designed. Beautifully lived in.'),
    ('Service: Apartments', 'Apartments'),
    ('Service: Bungalows', 'Bungalows and Villas'),
    ('Service: Offices', 'Offices'),
    ('Service: Hotels', 'Hotels and Restaurants'),
    ('Service: Furniture', 'Custom Furniture'),
    ('Service: Renovations', 'Renovations'),
    ('Process Step 1', 'Consultation'),
    ('Process Step 2', 'Design'),
    ('Process Step 3', 'Execution'),
    ('Process Step 4', 'Handover')
]

for label, needle in checks:
    if needle.lower() in idx_content.lower() or needle in idx_content:
        safe_print(f"[PASS] {label}: Found")
    else:
        safe_print(f"[FAIL] {label}: NOT found!")
        all_ok = False

safe_print(f"\nOverall Verification Status: {'ALL CHECKS PASSED 100% PERFECTLY!' if all_ok else 'SOME ISSUES DETECTED'}")
