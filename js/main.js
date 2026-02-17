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
    
    // Initialize form handling
    initBookingForm();
    initReviewForm();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize mobile scroll animations
    initMobileAnimations();
    
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
        
        // Save to localStorage
        saveReview(data);
        
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
   Mobile Scroll Animations
   =================================== */

function initMobileAnimations() {
    // Only run on mobile (under 768px)
    if (window.innerWidth > 768) return;
    
    // Elements to animate on scroll
    const animateElements = [
        ...document.querySelectorAll('.feature-card'),
        ...document.querySelectorAll('.quote'),
        ...document.querySelectorAll('.schedule-card'),
        ...document.querySelectorAll('.review-card'),
        ...document.querySelectorAll('.section-title')
    ];
    
    // Add mobile-animate class to elements
    animateElements.forEach(el => {
        el.classList.add('mobile-animate');
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/* ===================================
   Interactive Gallery with Auto-Scroll
   =================================== */

function initGalleryAnimation() {
    const galleryTrack = document.getElementById('gallery-track');
    if (!galleryTrack) return;
    
    // Configuration
    const CONFIG = {
        autoScrollSpeed: 0.8,        // Pixels per frame
        tapThreshold: 8,             // Max movement for tap vs swipe (px)
        momentumFriction: 0.95,      // Velocity decay after drag
        resumeDelay: 2000,           // Ms before auto-scroll resumes
        minVelocityThreshold: 0.1    // Min velocity to continue momentum
    };
    
    // State
    let position = 0;
    let velocity = 0;
    let isDragging = false;
    let isTap = true;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let dragStartPosition = 0;
    let animationId = null;
    let resumeTimeout = null;
    let isPaused = false;
    let trackWidth = 0;
    let isVerticalScroll = false;
    
    // Calculate track width (half since content is duplicated)
    const updateTrackWidth = () => {
        trackWidth = galleryTrack.scrollWidth / 2;
    };
    
    // Apply transform
    const setPosition = (x) => {
        galleryTrack.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    
    // Handle infinite loop
    const wrapPosition = () => {
        if (trackWidth <= 0) return;
        
        // Wrap around when reaching ends
        if (position <= -trackWidth) {
            position += trackWidth;
        } else if (position > 0) {
            position -= trackWidth;
        }
    };
    
    // Main animation loop
    const animate = () => {
        if (!isDragging) {
            if (Math.abs(velocity) > CONFIG.minVelocityThreshold) {
                // Apply momentum after drag
                position += velocity;
                velocity *= CONFIG.momentumFriction;
            } else if (!isPaused) {
                // Auto-scroll
                position -= CONFIG.autoScrollSpeed;
                velocity = 0;
            }
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
        }, CONFIG.resumeDelay);
    };
    
    // Pointer down handler
    const onPointerDown = (e) => {
        // Ignore right-click
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        
        isDragging = true;
        isTap = true;
        isVerticalScroll = false;
        startX = e.clientX;
        startY = e.clientY;
        lastX = e.clientX;
        dragStartPosition = position;
        velocity = 0;
        
        galleryTrack.classList.add('is-dragging');
        galleryTrack.setPointerCapture(e.pointerId);
        
        // Stop any momentum
        if (resumeTimeout) clearTimeout(resumeTimeout);
        isPaused = true;
    };
    
    // Pointer move handler
    const onPointerMove = (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // First movement: determine if horizontal or vertical scroll
        if (isTap && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
            // If vertical movement is dominant, let the page scroll
            if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
                isVerticalScroll = true;
                isDragging = false;
                galleryTrack.classList.remove('is-dragging');
                galleryTrack.releasePointerCapture(e.pointerId);
                isPaused = false;
                return;
            }
        }
        
        // Check if movement exceeds tap threshold
        if (Math.abs(deltaX) > CONFIG.tapThreshold) {
            isTap = false;
        }
        
        // Calculate velocity for momentum
        velocity = e.clientX - lastX;
        lastX = e.clientX;
        
        // Update position
        position = dragStartPosition + deltaX;
        setPosition(position);
    };
    
    // Pointer up handler
    const onPointerUp = (e) => {
        if (!isDragging && !isVerticalScroll) return;
        
        isDragging = false;
        galleryTrack.classList.remove('is-dragging');
        
        try {
            galleryTrack.releasePointerCapture(e.pointerId);
        } catch (err) {
            // Pointer capture may already be released
        }
        
        // If it was a tap (not a swipe), allow the link to work
        // The click event will handle navigation
        
        // Start momentum and schedule auto-scroll resume
        if (!isTap) {
            pauseAutoScroll();
        } else {
            // Reset pause state for taps
            isPaused = false;
        }
    };
    
    // Click handler - prevent navigation on swipe
    const onClick = (e) => {
        if (!isTap) {
            e.preventDefault();
            e.stopPropagation();
        }
        // If it was a tap, let the default link behavior happen
    };
    
    // Handle visibility change
    const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            // Page visible - ensure animation is running
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        } else {
            // Page hidden - pause animation
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
    };
    
    // Initialize
    updateTrackWidth();
    
    // Use ResizeObserver to update track width when images load
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            updateTrackWidth();
        });
        resizeObserver.observe(galleryTrack);
    }
    
    // Also update on window resize
    window.addEventListener('resize', updateTrackWidth);
    
    // Attach pointer event listeners
    galleryTrack.addEventListener('pointerdown', onPointerDown);
    galleryTrack.addEventListener('pointermove', onPointerMove);
    galleryTrack.addEventListener('pointerup', onPointerUp);
    galleryTrack.addEventListener('pointercancel', onPointerUp);
    galleryTrack.addEventListener('click', onClick, true); // Capture phase
    
    // Handle visibility
    document.addEventListener('visibilitychange', onVisibilityChange);
    
    // Use Intersection Observer to pause when not visible
    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) {
                    animationId = requestAnimationFrame(animate);
                }
            } else {
                // Optionally pause when not in view (saves CPU)
                // Uncomment if desired:
                // if (animationId) {
                //     cancelAnimationFrame(animationId);
                //     animationId = null;
                // }
            }
        });
    }, { threshold: 0.1 });
    
    intersectionObserver.observe(galleryTrack);
    
    // Start animation
    animationId = requestAnimationFrame(animate);
}
