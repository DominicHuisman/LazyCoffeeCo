# Lazy Coffee Co. — First Draft Summary

**Live Preview:** https://lazycoffeeco.vercel.app

---

## What We Built

### Customer Website
- **Hero Section** — Brand intro with CTAs and Instagram link
- **Feature Cards** — Specialty Coffee, Pop-Ups, Catering
- **Weekly Schedule** — Locations with smart map links (Apple/Google)
- **Catering Section** — Services overview and quote request
- **Photo Gallery** — Infinite scrolling marquee linked to Instagram
- **Booking Form** — Complete inquiry form with validation
- **Mobile Responsive** — Works on all devices

### Owner Admin Portal
- Manage weekly schedule
- Update gallery images
- Edit testimonials
- View/export form submissions
- Change business settings

---

## Design Highlights

| Element | Choice |
|---------|--------|
| Colors | Sage green, cream, forest green |
| Fonts | Playfair Display (headings), Inter (body) |
| Style | Clean, minimal, premium feel |
| Animations | Smooth scroll effects, hover states |

---

## What We Need From You

**Required:**
- [ ] Gallery photos (coffee, events, setup)
- [ ] Real testimonials from customers
- [ ] This week's schedule
- [ ] Confirm Instagram handle

**Optional:**
- [ ] Hero background image
- [ ] Updated logo
- [ ] CRM webhook for form submissions

---

## Your Feedback

Please review and let us know:
1. Any changes to colors or styling?
2. Are all booking form fields correct?
3. Any sections to add or remove?
4. Content or text adjustments?

---

## CRM Integration — HoneyBook via Make.com (HTTP Method)

HoneyBook has no native Make.com module, so we use the email-to-lead method.

### What You Need From the Client
- Their **HoneyBook inquiry email address** (found in HoneyBook → Settings → Lead Capture → Contact Form)

### Setup Steps

**Step 1 — Get the HoneyBook inquiry email**
- Client goes to HoneyBook: Settings → Lead Capture → Contact Form
- Copies their unique inquiry email (e.g. `inquiries+abc123@honeybook.com`)
- Emails sent to this address auto-create leads in their HoneyBook pipeline

**Step 2 — Create the Make.com Scenario**
1. Module 1: **Webhooks → Custom Webhook** (trigger)
   - Click "Add" to create a new webhook
   - Copy the generated URL
2. Module 2: **Email → Send an Email** (or Gmail/SMTP module)
   - **To:** Client's HoneyBook inquiry email from Step 1
   - **Subject:** `New Inquiry from {{name}}`
   - **Body:** Map the form fields:
     ```
     Name: {{name}}
     Email: {{email}}
     Phone: {{phone}}
     Event Date: {{date}}
     Event Type: {{eventType}}
     Guests: {{guests}}
     Message: {{message}}
     Submitted: {{submitted_at}}
     ```

**Step 3 — Paste webhook URL in admin portal**
- Go to https://lazycoffeeco.vercel.app/admin.html
- Settings → CRM Webhook URL field
- Paste the Make.com webhook URL → Save

**Step 4 — Test**
- Submit a test booking on the website
- Check Make.com to confirm the scenario ran
- Check HoneyBook to see the new lead appear

---

*Full details in CLIENT_REVIEW_DOCUMENT.md*
