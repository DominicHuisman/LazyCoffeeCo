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

## CRM Integration — EmailJS (Email + SMS)

Form submissions now go through **EmailJS** — no Make.com or Zapier needed.

### How It Works
1. Customer fills out booking form on the site
2. **Email** sent to `info@lazycoffeeco.com` with full inquiry details
3. **Text message** sent to client's phone (954-401-2523) via AT&T gateway
4. **Saved to Firebase** — viewable in admin portal under Submissions tab

### EmailJS Configuration
- **Service ID:** `service_4ttgfi8`
- **Template ID:** `template_2cssasc`
- **Public Key:** `xu9T_32dzQRF9iX42`
- **Free tier:** 200 emails/month
- **Sends from:** lazycoffeeco@gmail.com

### Admin Portal — Submissions
- All form submissions now stored in Firebase (not localStorage)
- View all submissions in admin portal → Submissions tab
- Each submission shows: name, email, phone, inquiry type, event date, guest count, location, message, timestamp
- **Delete** individual submissions
- **Export CSV** of all submissions

---

## Other Updates (Feb 27, 2026)

### Social Sharing (OG Tags)
- Added Open Graph image (1200x630) for social media previews
- Site now shows branded preview when shared on Facebook, Twitter, iMessage, etc.
- Custom image with sage green branding, "LAZY COFFEE CO." title, and CTA

### Mobile CTA Fix
- "Book Catering" button now properly visible in mobile hamburger menu
- Moved inside nav menu structure so it renders correctly on all devices

### Gallery Scroll Fix
- Fixed issue where gallery couldn't be dragged/scrolled on desktop
- Changed gallery track from `<a>` tag to `<div>` (link was intercepting drag events)
- Instagram link still accessible via "Follow @lazycoffeeco" button below gallery

### Favicon
- Added PNG and SVG favicons (coffee cup icon with sage green theme)
- Shows in browser tabs and bookmarks

---

*Full details in CLIENT_REVIEW_DOCUMENT.md*
