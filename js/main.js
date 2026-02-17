/* ===================================
   Lazy Coffee Co. - Main JavaScript
   Handles dynamic content rendering
   and form submissions
   =================================== */

document.addEventListener('DOMContentLoaded', async function() {
    // Scroll to top on page load (fixes mobile refresh issue)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    // Load data from cloud first, then render
    let data;
    try {
        data = await getDataAsync();
    } catch (e) {
        data = getData(); // Fallback to cached/local
    }
    
    renderMenu(data.menu);
    renderSchedule(data.schedule);
    renderTestimonials(data.testimonials);
    renderGallery(data.gallery);
    renderFooterContact(data);
    
    // Initialize form handling
    initBookingForm();
    initReviewForm();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Fix gallery animation on mobile
    initGalleryAnimation();
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
    const imagesHtml = createGalleryItems();
    galleryTrack.innerHTML = imagesHtml + imagesHtml;
}

/* ===================================
   Footer Contact Rendering
   =================================== */

function renderFooterContact(data) {
    const container = document.getElementById('footer-contact-info');
    if (!container) return;
    
    const biz = data.business || {};
    const instaUrl = biz.instagram || data.instagramUrl || '#';
    
    let html = '';
    
    if (instaUrl && instaUrl !== '#') {
        html += `<a href="${instaUrl}" class="contact-link" target="_blank" rel="noopener noreferrer">Instagram</a>`;
    }
    
    if (biz.email) {
        html += `<a href="mailto:${biz.email}" class="contact-link">${biz.email}</a>`;
    }
    
    if (biz.phone) {
        html += `<a href="tel:${biz.phone.replace(/[^+\d]/g, '')}" class="contact-link">${biz.phone}</a>`;
    }
    
    if (html) {
        container.innerHTML = html;
    }
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
   Review Form Handling
   =================================== */

function initReviewForm() {
    const form = document.getElementById('review-form');
    const successMessage = document.getElementById('review-success');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add timestamp
        data.submitted_at = new Date().toISOString();
        data.type = 'review';
        
        // Save to cloud as pending review
        try {
            const siteData = await getDataAsync();
            if (!siteData.pendingReviews) {
                siteData.pendingReviews = [];
            }
            siteData.pendingReviews.push({
                id: Date.now(),
                name: data.reviewer_name,
                text: data.review_text,
                submitted_at: data.submitted_at
            });
            await saveDataToCloud(siteData);
        } catch (err) {
            console.error('Error saving review to cloud:', err);
            // Fallback to localStorage
            saveReview(data);
        }
        
        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Reset after 4 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
        }, 4000);
    });
}

// Save reviews to localStorage
function saveReview(data) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push(data);
    localStorage.setItem('reviews', JSON.stringify(reviews));
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
   ===================================*/

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

/* ===================================
   Interactive Gallery with Auto-Scroll
   =================================== */

function initGalleryAnimation() {
    const galleryTrack = document.getElementById('gallery-track');
    const galleryMarquee = document.getElementById('gallery-marquee');
    if (!galleryTrack) return;
    
    // Configuration
    const CONFIG = {
        autoScrollSpeed: 0.5,        // Pixels per frame (slower = smoother)
        tapThreshold: 8,             // Max movement for tap vs swipe (px)
        momentumFriction: 0.92,      // Velocity decay after drag
        resumeDelay: 800,            // Ms before auto-scroll resumes
        minVelocityThreshold: 0.5,   // Min velocity to continue momentum
        easing: 0.08                 // Easing factor for smooth catch-up
    };
    
    // State
    let position = 0;
    let targetPosition = 0;
    let velocity = 0;
    let isDragging = false;
    let isTap = true;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastTime = 0;
    let dragStartPosition = 0;
    let animationId = null;
    let resumeTimeout = null;
    let isPaused = false;
    let trackWidth = 0;
    let pointerId = null;
    
    // Calculate track width (half since content is duplicated)
    const updateTrackWidth = () => {
        trackWidth = galleryTrack.scrollWidth / 2;
    };
    
    // Apply transform with GPU acceleration
    const setPosition = (x) => {
        galleryTrack.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    
    // Handle infinite loop
    const wrapPosition = () => {
        if (trackWidth <= 0) return;
        
        if (position <= -trackWidth) {
            position += trackWidth;
            targetPosition += trackWidth;
        } else if (position > 0) {
            position -= trackWidth;
            targetPosition -= trackWidth;
        }
    };
    
    // Main animation loop
    const animate = () => {
        if (!isDragging) {
            if (Math.abs(velocity) > CONFIG.minVelocityThreshold) {
                // Apply momentum after drag with easing
                targetPosition += velocity;
                velocity *= CONFIG.momentumFriction;
            } else if (!isPaused) {
                // Auto-scroll
                targetPosition -= CONFIG.autoScrollSpeed;
                velocity = 0;
            }
            
            // Smooth easing toward target
            position += (targetPosition - position) * CONFIG.easing;
        }
        
        wrapPosition();
        setPosition(position);
        animationId = requestAnimationFrame(animate);
    };
    
    // Pause auto-scroll temporarily
    const pauseAutoScroll = () => {
        isPaused = true;
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            isPaused = false;
            // Fade back to auto-scroll smoothly
            galleryMarquee?.classList.remove('gallery-paused');
        }, CONFIG.resumeDelay);
    };
    
    // Pointer down handler
    const onPointerDown = (e) => {
        // Only handle primary button (left click / touch)
        if (e.button !== 0) return;
        
        isDragging = true;
        isTap = true;
        pointerId = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        lastX = e.clientX;
        lastTime = Date.now();
        dragStartPosition = position;
        targetPosition = position;
        velocity = 0;
        
        galleryTrack.classList.add('is-dragging');
        galleryMarquee?.classList.add('gallery-paused');
        
        // Stop any pending resume
        if (resumeTimeout) clearTimeout(resumeTimeout);
        isPaused = true;
        
        // Prevent text selection
        e.preventDefault();
    };
    
    // Pointer move handler (on document to catch moves outside element)
    const onPointerMove = (e) => {
        if (!isDragging || e.pointerId !== pointerId) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const now = Date.now();
        const dt = Math.max(now - lastTime, 1);
        
        // Determine if this is a vertical scroll attempt
        if (isTap && Math.abs(deltaY) > Math.abs(deltaX) * 2 && Math.abs(deltaY) > 10) {
            // User is scrolling vertically - release
            isDragging = false;
            galleryTrack.classList.remove('is-dragging');
            isPaused = false;
            return;
        }
        
        // Check if movement exceeds tap threshold
        if (Math.abs(deltaX) > CONFIG.tapThreshold) {
            isTap = false;
        }
        
        // Calculate velocity based on time delta
        velocity = (e.clientX - lastX) / dt * 16; // Normalize to ~60fps
        lastX = e.clientX;
        lastTime = now;
        
        // Update position directly during drag
        position = dragStartPosition + deltaX;
        targetPosition = position;
        setPosition(position);
    };
    
    // Pointer up handler
    const onPointerUp = (e) => {
        if (!isDragging || e.pointerId !== pointerId) return;
        
        isDragging = false;
        pointerId = null;
        galleryTrack.classList.remove('is-dragging');
        
        // Apply momentum and schedule auto-scroll resume
        if (!isTap) {
            // Boost velocity slightly for snappier feel
            velocity *= 1.2;
            pauseAutoScroll();
        } else {
            isPaused = false;
            galleryMarquee?.classList.remove('gallery-paused');
        }
    };
    
    // Click handler - prevent navigation on swipe
    const onClick = (e) => {
        if (!isTap) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    
    // Handle pointer leaving window
    const onPointerCancel = (e) => {
        if (isDragging && e.pointerId === pointerId) {
            isDragging = false;
            pointerId = null;
            galleryTrack.classList.remove('is-dragging');
            pauseAutoScroll();
        }
    };
    
    // Handle visibility change
    const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        } else {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
    };
    
    // Initialize
    updateTrackWidth();
    
    // Update track width when images load or resize
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(updateTrackWidth);
        resizeObserver.observe(galleryTrack);
    }
    window.addEventListener('resize', updateTrackWidth);
    
    // Attach event listeners
    // Use gallery container for pointer down to limit capture area
    galleryTrack.addEventListener('pointerdown', onPointerDown);
    
    // Use document for move/up to handle drag outside gallery
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
    
    // Prevent link on swipe
    galleryTrack.addEventListener('click', onClick, true);
    
    // Prevent default drag behavior on images
    galleryTrack.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Visibility handling
    document.addEventListener('visibilitychange', onVisibilityChange);
    
    // Start animation
    animationId = requestAnimationFrame(animate);
}
