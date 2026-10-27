# Align Interiors / Align Architecture & Interiors
## Premium Single-Page Demo Website Documentation

A handcrafted, high-converting static single-page demo website for **Align Architecture & Interiors**, led by Rakesh Dashpute in Erandwane, Pune, Maharashtra.

Built strictly with **pure semantic HTML5, modern CSS3, and vanilla JavaScript**. No React, Next.js, TypeScript, Tailwind CSS, or frontend build steps are used or required.

### Key Architecture Features
- **One-Page Demo Experience (`index.html`)**: All sections are accessible directly via smooth internal anchor navigation (`#services`, `#projects`, `#videos`, `#process`, `#reviews`, `#about`, `#contact`) with a fixed 90px header offset calculation and live ScrollSpy nav link highlighting.
- **Direct YouTube Video Streaming**: Video tours stream directly using official YouTube embed links (`youtube-nocookie.com/embed/...`) without requiring any large video downloads.
- **Verified Google Maps CID Embed**: Integrates the exact Google Maps CID (`3964990284371836881`) and latitude/longitude coordinates (`18.504896, 73.831707`) for Erandwane, Pune.
- **Interactive Project Portfolio & Lightbox**: Dynamic category filtering (Apartments, Bungalows, Commercial, Kitchens, Bedrooms) and a full-screen accessible photo lightbox with keyboard navigation (Escape, Left/Right arrows).
- **Authentic Client Reviews**: Features all 7 authentic Google reviews with a 4.9★ rating from 136 verified reviews.

---

## 1. Quick Start — Running Locally

You do not need npm packages or complicated build tools. To run the website locally:

### Option A: Using Python (Recommended & Built-in)
1. Open PowerShell or Command Prompt in the project folder:
   ```powershell
   cd "D:\freelancing project\Align-Interiors-demo"
   ```
2. Start Python's built-in static server:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and visit:
   ```text
   http://localhost:8000
   ```

### Option B: Using VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click on `index.html` and click **"Open with Live Server"**.

### Option C: Run Integrity Verification
To verify that all HTML pages, CSS files, JavaScript scripts, images, and links are 100% intact with zero broken paths:
```bash
python test_validator.py
```

---

## 2. Project File Structure

```text
Align-Interiors-demo/
├── index.html                    # Homepage (Hero, Trust, Services, Process, Video Tours, Reviews, Contact)
├── projects.html                 # Portfolio Gallery (Interactive Category Filters, Lightbox & Video Tours)
├── about.html                    # Studio Philosophy, Approach & Principal Designer Profile
├── contact.html                  # Full Enquiry Form, Verified Google Maps CID, Click-to-Call & WhatsApp
├── 404.html                      # Branded 404 Error Page
├── robots.txt                    # Search Engine Crawler Directives
├── sitemap.xml                   # XML Sitemap for Local Search Engines
├── favicon.svg                   # Vector Architectural Favicon
├── favicon.ico                   # Standard Browser Favicon
├── test_validator.py             # Automated 100% Site Integrity & Asset Verification Test Script
├── css/
│   └── style.css                 # Central Stylesheet (Fluid Typography, Warm Editorial Tokens, Video & Lightbox)
├── js/
│   ├── main.js                   # Mobile Drawer, Copyright Year, Fallback Handlers & Video Modal
│   ├── projects.js               # Portfolio Category Filtering & Accessible Lightbox
│   └── contact.js                # Form Validation (Indian Phone Formats, Anti-spam & Submit)
├── data/
│   └── site-data.js              # Central Business Information, Services, Reviews, Projects & Videos
├── images/
│   ├── hero.jpg                  # Primary Homepage Hero Photograph (Authentic Pune 3BHK Living Room)
│   ├── rakesh.jpg                # Portrait of Lead Designer Rakesh Dashpute
│   ├── placeholders/             # Architectural Vector Fallback Drawings (.svg)
│   └── projects/                 # Project & Service Photographs (.jpg)
│       ├── apartment-living.jpg  # 2BHK/3BHK Living & Dining Flow
│       ├── bungalow-villa.jpg    # Villa Double-Height Volume (Dhanori, Pune)
│       ├── commercial-office.jpg # Commercial Workspace Suite
│       ├── restaurant-interior.jpg # Hospitality Space
│       ├── custom-furniture.jpg  # Custom Millwork & Joinery
│       ├── renovation.jpg        # Turnkey Transformation
│       └── project-1.jpg to project-6.jpg
├── videos/                       # Folder for local MP4 walkthrough reels
├── netlify/
│   └── functions/
│       └── submit-enquiry.js     # Serverless Form Handler with Honeypot & Email Provider Integration
├── .env.example                  # Environment Variables Template for Email Dispatch
├── netlify.toml                  # Netlify Deployment Configuration & Security Headers
└── README.md                     # This Guide
```

---

## 3. Real Local Business Assets

### A. Authentic Project Photographs
The website includes real high-resolution photographs from completed projects in Pune:
- **`images/hero.jpg`**: Living & dining space from Align Interiors' 3BHK project in Pune.
- **`images/rakesh.jpg`**: Official portrait of lead designer Rakesh Dashpute.
- **`images/projects/`**: Real apartment, modular kitchen, master bedroom, and villa photos from Pune projects (Pimpri-Chinchwad, Dhanori, Prabhat Road).

*Note: The website features an automatic fallback system. If an image file is removed, it displays a clean architectural drawing instead of a broken image icon.*

### B. Project Video Walkthroughs
The site features interactive video walkthroughs connected to the official YouTube channel **@aligninteriorsbyrakeshdashpute**:
- "Inside a Stylish 3BHK Where Every Detail Matters — Align Interiors" (`dOWvShacZAQ`)
- "Modern 2BHK Apartment Interior Tour — Prabhat Road, Pune" (`AF9hIb1qsPs`)
- "Explore a Luxurious 3BHK in Dhanori, Pune" (`xB0in24VyzQ`)
- "A Beautiful 3 BHK Home Tour You'll Love" (`c1r-nQM7qjM`)

Clicking any video card opens an accessible modal with native playback (`youtube-nocookie.com`).

### C. Verified Google Maps Location
The Google Maps embed and links are configured with Align Interiors' verified CID:
- **Listing CID**: `3964990284371836881`
- **Coordinates**: `18.504896, 73.831707`
- **Embed URL**: `https://maps.google.com/maps?cid=3964990284371836881&t=m&z=16&output=embed`
- **Address**: Estonia Office No. 504-B, Gulawani Maharaj Road, opposite Mehendale Garage, Erandwane, Pune, Maharashtra 411004.

---

## 4. How to Update Content

### A. Updating Business Details, Phone & WhatsApp
All core business information is centralized in **`data/site-data.js`**.
Open `data/site-data.js` to modify phone numbers, opening hours, or social links.

### B. Adding Local Videos
To feature offline MP4 video files instead of YouTube:
1. Place your `.mp4` file in `videos/` (e.g. `videos/erandwane-walkthrough.mp4`).
2. Use standard HTML5 video:
   ```html
   <video controls preload="none" playsinline poster="images/hero.jpg" style="width: 100%; border-radius: 16px;">
     <source src="videos/erandwane-walkthrough.mp4" type="video/mp4">
     Your browser does not support HTML5 video.
   </video>
   ```

### C. Editing Customer Reviews
Customer testimonials are located in **`data/site-data.js`** under `reviews` and embedded in **`index.html`** under `#reviews`.

---

## 5. Contact Form & Email Delivery

The contact form validates input:
- Verifying Indian 10-digit mobile numbers starting with 6–9.
- Required full name (minimum 2 characters).
- Project type selection.
- Anti-spam hidden honeypot field.

Because browser JavaScript cannot securely send emails without exposing private credentials, a serverless function is provided in `netlify/functions/submit-enquiry.js`.

### How to Activate Live Email Delivery:
1. Sign up for a free email provider like [Resend](https://resend.com) or SendGrid.
2. Get your API Key.
3. In your Netlify dashboard:
   - Go to **Site Settings > Build & deploy > Environment > Environment variables**.
   - Add:
     - `RESEND_API_KEY`: your API key (e.g. `re_123456...`)
     - `NOTIFICATION_EMAIL`: the email where you want enquiries delivered (e.g. `info@aligninteriors.in`).
     - `SENDER_EMAIL`: your verified sender domain (e.g. `enquiries@aligninteriors.in`).
4. In static mode (or before backend credentials are configured), the website validates the enquiry and offers a one-click button to send the prefilled details directly via WhatsApp so no enquiry is ever lost!

---

## 6. Deployment Options

### Option 1: Netlify (Recommended)
1. Push this folder to a GitHub repository or drag-and-drop the entire folder into [Netlify Drop](https://app.netlify.com/drop).
2. Netlify will detect `netlify.toml` and automatically host the static website and serverless function.
3. Free SSL certificate is provisioned automatically.

### Option 2: GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to **Repository Settings > Pages**.
3. Under **Branch**, select `main` (root) and click **Save**.
4. The site will be live at `https://<username>.github.io/<repo-name>/`.

---

## 7. SEO & Schema.org Structured Data

Each page includes:
- Unique titles and meta descriptions tailored for Pune local interior searches.
- Canonical tags.
- Open Graph tags.
- Schema.org `HomeAndConstructionBusiness` & `LocalBusiness` JSON-LD with exact coordinates (`18.504896, 73.831707`), 4.9★ rating (136 reviews), verified CID, and business address.
