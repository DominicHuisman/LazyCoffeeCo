# Lazy Coffee Co. — Website Draft Review Document

**Prepared by:** Development Team  
**Date:** January 30, 2026  
**Version:** 1.0 (First Draft)  
**Live Preview:** [lazycoffeeco.vercel.app](https://lazycoffeeco.vercel.app)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Website Structure](#2-website-structure)
3. [Design & Branding](#3-design--branding)
4. [Features Delivered](#4-features-delivered)
5. [Admin Portal](#5-admin-portal)
6. [Technical Specifications](#6-technical-specifications)
7. [Mobile Responsiveness](#7-mobile-responsiveness)
8. [Items for Client Review](#8-items-for-client-review)
9. [Next Steps](#9-next-steps)

---

## 1. Project Overview

We have developed a complete, mobile-responsive website for **Lazy Coffee Co.**, a premium coffee and ceremonial matcha pop-up business serving South Florida. The website serves as both a customer-facing landing page and a business tool for managing bookings and content.

### Objectives Achieved:
- ✅ Professional, modern design reflecting the brand's premium positioning
- ✅ Mobile-first responsive design for all devices
- ✅ Dynamic content management through admin portal
- ✅ Booking/inquiry form for catering requests
- ✅ Integration-ready architecture (CRM webhooks, Calendly)
- ✅ Fast, animated user experience with smooth transitions

---

## 2. Website Structure

### Public-Facing Pages

| Section | Purpose |
|---------|---------|
| **Hero** | Brand introduction with tagline, CTAs, and Instagram callout |
| **Features** | Three-card overview of services (Coffee + Matcha, Pop-Ups, Catering) |
| **Schedule** | This week's pop-up locations with times and map links |
| **Catering** | Event services overview with feature list |
| **Testimonials** | Customer quotes and scrolling photo gallery |
| **Booking Form** | Full catering inquiry form with validation |
| **Footer** | Quick links, social media, and admin portal access |

### Admin Portal
- Password-protected management dashboard
- Located at `/admin.html`
- Accessible via subtle link in footer

---

## 3. Design & Branding

### Color Palette — Sage Green Theme

| Color | Hex Code | Usage |
|-------|----------|-------|
| Sage Green | `#9BB09A` | Primary buttons, accents |
| Sage Dark | `#7A9479` | Hover states |
| Sage Light | `#B5C9B4` | Backgrounds, gradients |
| Cream | `#F5F2E8` | Main background |
| Forest Dark | `#2C4438` | Headings, text emphasis |

### Typography

| Font | Style | Usage |
|------|-------|-------|
| **Playfair Display** | Serif | Headings, hero text, Instagram callout |
| **Inter** | Sans-serif | Body text, navigation, buttons |

### Visual Style
- Clean, minimal aesthetic with generous whitespace
- Subtle shadows and borders for depth
- Rounded corners on cards and buttons
- Professional imagery placeholders

---

## 4. Features Delivered

### 4.1 Navigation Bar
- Fixed position (stays visible while scrolling)
- Shrinks elegantly on scroll with blur effect
- Mobile hamburger menu for small screens
- Links: Schedule, Catering, Contact
- CTA button: "Book Catering"

### 4.2 Hero Section
- Large brand title with gradient background
- Tagline: "Premium coffee + ceremonial matcha pop-ups across South Florida"
- Two call-to-action buttons:
  - "View Schedule" → scrolls to schedule section
  - "Book Catering" → scrolls to booking form
- Instagram link with subtle styling (Playfair Display font)
- Parallax background effect (desktop only)

### 4.3 Feature Cards
- Three cards highlighting core offerings:
  1. **Specialty Coffee + Matcha** — "Small-batch, quality ingredients"
  2. **Weekly Pop-Ups** — "Markets, gyms & events"
  3. **Event & Catering Services** — "Weddings · Corporate · Parties"
- Hover effects with subtle lift animation

### 4.4 Weekly Schedule
- Card-based design with green header
- Displays: Day, Location, Time
- **Smart Map Links:**
  - Apple Maps on iOS/macOS devices
  - Google Maps on all other devices
- Address shown as clickable link below location name
- Empty state message when no events scheduled
- Fully managed through admin portal

### 4.5 Catering Section
- Section title with word-by-word reveal animation
- Subtitle: "Craft Coffee & Matcha for Your Next Event"
- Feature lists:
  - Full Service Espresso Bar
  - Custom Drink Menu
  - Friendly Baristas
  - Professional Setup
  - Event types (Weddings, Parties, Offices)
- CTA: "Request a Quote"

### 4.6 Testimonials & Gallery
- Three rotating customer quotes
- **Infinite Scrolling Photo Gallery:**
  - Horizontal marquee of images
  - Pauses on hover
  - Links to Instagram when clicked
  - Images managed through admin portal
- Instagram follow button with icon

### 4.7 Booking/Inquiry Form
- Complete lead capture form with fields:
  - Name (required)
  - Phone (required)
  - Email (required)
  - Inquiry Type dropdown (Wedding, Corporate, Party, Market, Other)
  - Event Date (date picker)
  - Guest Count (number input)
  - Location/City (required)
  - Message (textarea)
- Form validation built-in
- Success message after submission
- **EmailJS integration** — sends email to `info@lazycoffeeco.com` + SMS to client's phone
- **Firebase storage** — all submissions saved to cloud database, viewable in admin portal
- HoneyBook auto-capture compatible (emails trigger HoneyBook lead creation)

### 4.8 Footer
- Brand name and tagline
- Quick links (Schedule, Catering, Book Now)
- Social media section
- Copyright notice
- Hidden admin portal link

### 4.9 Animations & Interactions
- **Hero Entrance:** Staggered fade-in with blur effect
- **Scroll Animations:** Elements fade up as they enter viewport
- **Word Reveal:** Section titles animate word-by-word
- **Hover Effects:** Cards lift, buttons respond
- **Parallax:** Hero background moves slower than scroll (desktop)
- **Reduced Motion:** Respects user accessibility preferences

---

## 5. Admin Portal

### Access
- URL: `/admin.html`
- Password-protected login

### Dashboard Sections

#### 5.1 Schedule Manager
- Add, edit, and delete weekly pop-up events
- Fields: Day, Location, Address, Time
- Changes reflect immediately on main site

#### 5.2 Gallery Manager
- Add images via URL
- Set alt text for accessibility
- Preview thumbnails in admin
- Reorder and remove images

#### 5.3 Testimonials Manager
- Add and edit customer quotes
- Delete outdated testimonials
- Changes reflect immediately

#### 5.4 Settings
**Business Information:**
- Business Name
- Tagline
- Email
- Phone
- Instagram URL

**Integrations:**
- CRM Webhook URL (form submissions sent here)
- Calendly URL (booking integration)

**Security:**
- Change admin password

#### 5.5 Form Submissions
- View all booking inquiries (stored in Firebase cloud database)
- Details: Name, contact info, event details, message, timestamp
- Delete individual submissions
- Export to CSV functionality
- Sorted by date (newest first)
- Synced across all devices in real time

### Admin Features
- Auto-save with visual confirmation
- Clean, intuitive interface
- Mobile-responsive admin views
- Logout functionality

---

## 6. Technical Specifications

### Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Animations | GSAP 3.12.5 + ScrollTrigger |
| Fonts | Google Fonts (Playfair Display, Inter) |
| Icons | Custom SVG |
| Hosting | Vercel (auto-deploys from GitHub) |
| Version Control | Git/GitHub |
| Data Storage | Firebase Realtime Database (cloud-synced) |
| Form Notifications | EmailJS (email + SMS) |
| Social Sharing | Open Graph meta tags with branded image |

### Performance Features
- Lazy loading for gallery images
- Optimized CSS with custom properties
- Minimal JavaScript (no heavy frameworks)
- Efficient animation handling
- Quick load times

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 7. Mobile Responsiveness

The website has been optimized for all device sizes:

### Breakpoints

| Screen Size | Optimizations |
|-------------|---------------|
| **Desktop (768px+)** | Full layout, parallax effects, hover animations |
| **Tablet (768px and below)** | Collapsed navigation, simplified grid layouts |
| **Mobile (480px and below)** | Single-column layouts, touch-optimized buttons |

### Mobile-Specific Features
- Hamburger menu navigation
- Touch-friendly button sizes
- Readable font sizes
- Optimized form inputs (date picker fix applied)
- Gallery continues to scroll smoothly
- Reduced animation on mobile for performance

---

## 8. Items for Client Review

Please review the following and provide feedback:

### Content Review
- [ ] Business name and tagline accuracy
- [ ] Feature descriptions and service offerings
- [ ] Default testimonial quotes
- [ ] Catering features list

### Design Review
- [ ] Color palette (sage green theme) — approve or suggest adjustments
- [ ] Typography choices — approve or suggest alternatives
- [ ] Overall visual style and aesthetic
- [ ] Logo placement and sizing

### Functionality Review
- [ ] Navigation flow and user experience
- [ ] Booking form fields — are all required fields included?
- [ ] Schedule display format
- [ ] Gallery appearance and behavior

### Content to Provide
- [ ] **Photos for gallery** (high-quality images of your setup, drinks, events)
- [ ] **Hero background image** (optional custom image)
- [ ] **Logo file** (if different from current)
- [ ] **Instagram handle** (confirm: @lazycoffeeco)
- [ ] **Initial schedule** (this week's pop-up locations)
- [ ] **Real testimonials** from past customers
- [ ] **Contact email and phone** for inquiries
- [ ] **CRM webhook URL** (if using a CRM system)

---

## 9. Next Steps

### Phase 1: Client Review (Current)
- Review this document and live preview
- Provide feedback on design and content
- Submit required assets (photos, logo, testimonials)

### Phase 2: Revisions
- Implement requested changes
- Update with real content and imagery
- Fine-tune any design adjustments

### Phase 3: Pre-Launch
- Final content review
- Test all forms and integrations
- Connect custom domain (if applicable)
- SEO optimization

### Phase 4: Launch
- Go live with production content
- Set up admin password
- Train on admin portal usage
- Monitor for any issues

---

## Questions?

Please don't hesitate to reach out with any questions, feedback, or change requests. We want to ensure this website perfectly represents the Lazy Coffee Co. brand and serves your business needs.

---

**Document Version:** 2.0  
**Last Updated:** February 27, 2026

---

## Changelog

### v2.0 — February 27, 2026
- **EmailJS Integration** — Form submissions now email `info@lazycoffeeco.com` and text client's phone (954-401-2523) via AT&T SMS gateway. Free tier: 200 emails/month.
- **Firebase Form Submissions** — All bookings saved to Firebase cloud database. Viewable, deletable, and exportable in admin portal → Submissions tab.
- **Open Graph Tags** — Added branded 1200x630 social preview image. Site shows professional preview when shared on social media or iMessage.
- **Mobile CTA Fix** — "Book Catering" button now appears correctly in mobile hamburger menu.
- **Gallery Scroll Fix** — Gallery track changed from `<a>` to `<div>` to prevent link interference with drag/scroll behavior.
- **Favicon** — Added PNG and SVG favicons (sage green coffee cup).
- **HoneyBook Compatibility** — EmailJS sends to client's email, which HoneyBook's Lead Capture can auto-detect and create leads from.

### v1.0 — January 30, 2026
- Initial website build and delivery
