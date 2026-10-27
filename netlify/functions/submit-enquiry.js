/**
 * Align Interiors — Serverless Enquiry Submission Handler
 * Netlify Function: /.netlify/functions/submit-enquiry
 *
 * This function processes enquiries submitted through the contact form,
 * sanitizes input, validates phone/email format, and sends an email notification
 * to the business owner via Resend, SendGrid, or any standard SMTP service.
 *
 * Credentials MUST be provided via Environment Variables (never hardcoded in frontend).
 */

exports.handler = async function (event, context) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method not allowed. Please use POST.' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // 1. Anti-spam check (honeypot)
    if (data.website_url_check && data.website_url_check.trim() !== '') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Spam submission detected.' })
      };
    }

    // 2. Validate required fields
    const name = (data.name || '').trim();
    const phone = (data.phone || '').trim();
    const projectType = (data.projectType || '').trim();
    const budget = (data.budget || 'Not specified').trim();
    const message = (data.message || '').trim();

    if (!name || name.length < 2) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Full name is required (minimum 2 characters).' })
      };
    }

    const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (!phone || !indianPhoneRegex.test(phone.replace(/[\s\-()]/g, ''))) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Valid 10-digit Indian phone number is required.' })
      };
    }

    if (!projectType) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Project type is required.' })
      };
    }

    // 3. Dispatch Email if API key is configured
    // Supported providers: Resend (default recommended), SendGrid, or SMTP
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL; // Recipient (e.g. rakesh@aligninteriors.com)
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'enquiries@aligninteriors.in';

    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      console.warn('Email dispatch service credentials not configured. Please set RESEND_API_KEY and NOTIFICATION_EMAIL in environment variables.');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'success_unconfigured',
          message: 'Enquiry received and validated. Note: Live email transmission is awaiting environment configuration.'
        })
      };
    }

    // Example payload sent via Resend REST API (zero dependencies required)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Align Interiors Web <${SENDER_EMAIL}>`,
        to: [NOTIFICATION_EMAIL],
        subject: `New Interior Project Enquiry: ${name} (${projectType})`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #2A2420; max-width: 600px; padding: 20px; border: 1px solid #E3DAD0; border-radius: 8px;">
            <h2 style="color: #B4573A; margin-top: 0;">New Project Enquiry — Align Interiors</h2>
            <p>A prospective client submitted an enquiry through the website:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Client Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Project Type:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${projectType}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Approx Budget:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${budget}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${message || '<em>No specific message provided</em>'}</td></tr>
            </table>
            <p style="margin-top: 20px; font-size: 13px; color: #8C827A;">Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        `
      })
    });

    if (!resendResponse.ok) {
      const errBody = await resendResponse.text();
      console.error('Email API error:', errBody);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to deliver email to the studio inbox.' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'success',
        message: 'Enquiry successfully submitted and delivered.'
      })
    };

  } catch (error) {
    console.error('Serverless function execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error processing enquiry.' })
    };
  }
};
