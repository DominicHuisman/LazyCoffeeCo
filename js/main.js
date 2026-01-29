/* ===================================
   Lazy Coffee Co. - Main JavaScript
   Handles dynamic content rendering
   and form submissions
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Load and render all dynamic content
    const data = getData();
    
    renderMenu(data.menu);
    renderSchedule(data.schedule);
    renderTestimonials(data.testimonials);
    renderGallery(data.gallery);
    
    // Initialize form handling
    initBookingForm();
    
    // Initialize mobile menu
    initMobileMenu();
});

/* ===================================
   Menu Rendering
   =================================== */

function renderMenu(menuData) {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid || !menuData || !menuData.categories) return;
    
    menuGrid.innerHTML = '';
    
    menuData.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'menu-category';
        
        let itemsHtml = category.items.map(item => `<li>${item}</li>`).join('');
        let noteHtml = category.note ? `<p class="menu-note">${category.note}</p>` : '';
        
        categoryDiv.innerHTML = `
            <h3>${category.name}</h3>
            <ul>${itemsHtml}</ul>
            ${noteHtml}
        `;
        
        menuGrid.appendChild(categoryDiv);
    });
}

/* ===================================
   Schedule Rendering
   =================================== */

// Detect if user is on Apple device (iOS/macOS)
function isAppleDevice() {
    return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && !window.MSStream;
}

// Generate maps URL based on device
function getMapsUrl(address) {
    const encodedAddress = encodeURIComponent(address);
    if (isAppleDevice()) {
        return `https://maps.apple.com/?q=${encodedAddress}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

function renderSchedule(scheduleData) {
    const scheduleList = document.getElementById('schedule-list');
    if (!scheduleList || !scheduleData) return;
    
    scheduleList.innerHTML = '';
    
    if (scheduleData.length === 0) {
        scheduleList.innerHTML = '<p style="text-align: center; color: #888;">No upcoming events scheduled.</p>';
        return;
    }
    
    scheduleData.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        
        // Build address row if address exists
        let addressHtml = '';
        let mapsUrl = '';
        if (item.address) {
            mapsUrl = getMapsUrl(item.address);
            addressHtml = `
                <div class="schedule-address-row">
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="schedule-address-link">${item.address}</a>
                </div>`;
        }
        
        // Location can be a link if address exists
        const locationHtml = item.address 
            ? `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="schedule-location-link">${item.location}</a>`
            : `<span class="schedule-location">${item.location}</span>`;
        
        scheduleItem.innerHTML = `
            <div class="schedule-main-row">
                <span class="schedule-day">${item.day}</span>
                ${locationHtml}
                <span class="schedule-time">${item.time}</span>
            </div>
            ${addressHtml}
        `;
        
        scheduleList.appendChild(scheduleItem);
    });
}

/* ===================================
   Testimonials Rendering
   =================================== */

function renderTestimonials(testimonials) {
    const quotesContainer = document.querySelector('.testimonials-quotes');
    if (!quotesContainer || !testimonials) return;
    
    quotesContainer.innerHTML = '';
    
    testimonials.forEach(quote => {
        const quoteEl = document.createElement('p');
        quoteEl.className = 'quote';
        quoteEl.textContent = `"${quote}"`;
        quotesContainer.appendChild(quoteEl);
    });
}

/* ===================================
   Gallery Marquee Rendering
   =================================== */

function renderGallery(galleryData) {
    const galleryTrack = document.getElementById('gallery-track');
    if (!galleryTrack) return;
    
    galleryTrack.innerHTML = '';
    
    if (!galleryData || galleryData.length === 0) {
        const marquee = document.getElementById('gallery-marquee');
        if (marquee) {
            marquee.innerHTML = `
                <div class="gallery-placeholder-marquee">
                    <p>Gallery images coming soon</p>
                </div>
            `;
        }
        return;
    }
    
    // Create gallery items
    const createGalleryItems = () => {
        return galleryData.map(image => `
            <div class="gallery-item">
                <img src="${image.src}" alt="${image.alt || 'Lazy Coffee Co.'}" loading="lazy">
            </div>
        `).join('');
    };
    
    // Duplicate images for seamless infinite scroll
    // We need at least 2 sets of images for the loop to work smoothly
    const imagesHtml = createGalleryItems();
    galleryTrack.innerHTML = imagesHtml + imagesHtml;
    
    // Adjust animation speed based on number of images
    const itemCount = galleryData.length;
    const animationDuration = Math.max(20, itemCount * 5); // Min 20s, 5s per image
    galleryTrack.style.animationDuration = `${animationDuration}s`;
}

/* ===================================
   Booking Form Handling
   =================================== */

function initBookingForm() {
    const form = document.getElementById('booking-form');
    const successMessage = document.getElementById('form-success');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add timestamp
        data.submitted_at = new Date().toISOString();
        
        // Get CRM webhook URL from site data
        const siteConfig = getData();
        
        try {
            // If webhook URL is configured, send data
            if (siteConfig.crmWebhookUrl) {
                await fetch(siteConfig.crmWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
            }
            
            // Also save to localStorage as backup
            saveFormSubmission(data);
            
            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Reset after 5 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            // Still save locally even if webhook fails
            saveFormSubmission(data);
            alert('Thank you! Your request has been received.');
            form.reset();
        }
    });
}

// Save form submissions to localStorage
function saveFormSubmission(data) {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    submissions.push(data);
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
}

/* ===================================
   Mobile Menu
   =================================== */

function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

/* ===================================
   Smooth Scroll for anchor links
   =================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
