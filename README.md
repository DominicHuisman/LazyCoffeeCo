# Lazy Coffee Co. Website

**Repository:** https://github.com/DominicHuisman/LazyCoffeeCo.git

A custom landing page website for Lazy Coffee Co., featuring a main customer-facing page and an admin portal for content management.

## Project Structure

```
Lazy Coffee Co/
├── index.html          # Main landing page
├── admin.html          # Admin portal
├── css/
│   ├── style.css       # Main styles
│   └── admin.css       # Admin portal styles
├── js/
│   ├── data.js         # Site data & storage
│   ├── main.js         # Frontend functionality
│   └── admin.js        # Admin portal functionality
└── images/             # Image assets (add your own)
```

## Features

### Landing Page (index.html)
- Hero section with logo and CTAs
- Feature cards (Specialty Coffee, Weekly Pop-Ups, Events)
- Dynamic menu display
- Weekly schedule
- Catering & Events section
- Customer testimonials
- Booking/Inquiry form
- Mobile-responsive design

### Admin Portal (admin.html)
- Secure login (default password: `lazycoffee2026`)
- Menu management (add/edit/delete categories and items)
- Schedule management (add/edit weekly events)
- Testimonials management
- Business settings configuration
- CRM webhook integration
- View and export form submissions

## Getting Started

1. **Open the website**: Simply open `index.html` in a web browser
2. **Access admin**: Click "Admin Portal" link in the footer or navigate to `admin.html`
3. **Default password**: `lazycoffee2026` (change this immediately via Settings!)

## Admin Portal Usage

### Menu Management
- Click "Add Category" to create new menu sections
- Edit category names, add/remove items, add optional notes
- Changes save automatically

### Schedule Management
- Add weekly pop-up events with day, location, and time
- Easily update or remove outdated events

### Settings
- Update business information
- Set CRM webhook URL for form submissions
- Configure Calendly integration
- **Important**: Change the admin password!

### Form Submissions
- View all booking inquiries
- Export to CSV for CRM import

## Technical Notes

### Data Storage
All data is stored in the browser's `localStorage`. This means:
- Data persists on the same device/browser
- Each device will have its own data copy
- To sync across devices, you'll need to set up a backend (future enhancement)

### Form Submissions
- Submissions are saved to localStorage
- If a CRM webhook URL is configured, data is also sent there
- Export to CSV for backup/import to external systems

### Hosting
This is a static website that can be hosted on:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- Any web hosting service

## Future Enhancements

Consider adding:
- [ ] Backend API for data persistence across devices
- [ ] Image upload for gallery
- [ ] Calendly widget embed
- [ ] Email notifications for form submissions
- [ ] Google Calendar sync for schedule

## Support

For questions or updates outside the scope of this project, contact the developer.

---

© 2026 Lazy Coffee Co. All rights reserved.
