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
    
    // Remove skeleton placeholders
    const skeletons = scheduleList.querySelectorAll('.skeleton-placeholder');
    skeletons.forEach(s => s.remove());
    
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
    
    // Remove skeleton placeholders
    const skeletons = quotesContainer.querySelectorAll('.skeleton-placeholder');
    skeletons.forEach(s => s.remove());
    
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
                <img src="${image.src}" alt="${image.alt || 'Lazy Coffee Co.'}" loading="eager">
            </div>
        `).join('');
    };
    
    // Triple images for seamless infinite scroll (no gaps when wrapping)
    const imagesHtml = createGalleryItems();
    galleryTrack.innerHTML = imagesHtml + imagesHtml + imagesHtml;
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
        
        try {
            // Send via Web3Forms (emails directly to client)
            const web3Response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: 'YOUR_WEB3FORMS_KEY',
                    subject: `New Booking Inquiry — ${data.inquiry_type || 'General'}`,
                    from_name: 'Lazy Coffee Co. Website',
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    inquiry_type: data.inquiry_type,
                    event_date: data.event_date,
                    guest_count: data.guest_count,
                    location: data.location,
                    message: data.message || 'No additional details'
                })
            });
            
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
    
    // Close menu when clicking a link (including the CTA button)
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
    
    // Wait for all gallery images to load before starting animation
    const images = galleryTrack.querySelectorAll('img');
    if (images.length === 0) return;
    
    let loadedCount = 0;
    const totalImages = images.length;
    
    const onAllImagesReady = () => {
        startGalleryScroll(galleryTrack, galleryMarquee);
    };
    
    images.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            loadedCount++;
            if (loadedCount >= totalImages) onAllImagesReady();
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount >= totalImages) onAllImagesReady();
            });
            img.addEventListener('error', () => {
                loadedCount++;
                if (loadedCount >= totalImages) onAllImagesReady();
            });
        }
    });
    
    // Fallback: start after 3 seconds even if images haven't loaded
    setTimeout(() => {
        if (loadedCount < totalImages) onAllImagesReady();
    }, 3000);
}

function startGalleryScroll(galleryTrack, galleryMarquee) {
    // Configuration
    const SPEED = 0.5; // px per frame
    const MOMENTUM_FRICTION = 0.95;
    const RESUME_DELAY = 1000;
    const TAP_THRESHOLD = 8;
    
    // Track is tripled: [set1][set2][set3]
    // We scroll within set2's range and wrap seamlessly
    let oneSetWidth = galleryTrack.scrollWidth / 3;
    
    // Start at the beginning of the second set
    let pos = -oneSetWidth;
    let velocity = 0;
    let isDragging = false;
    let isTap = true;
    let isPaused = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastTime = 0;
    let dragStartPos = 0;
    let animId = null;
    let resumeTimer = null;
    let pointerId = null;
    
    const setPos = (x) => {
        galleryTrack.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    
    // Keep position within the middle set's range
    // When we scroll past set2 into set3, jump back to set1→set2 boundary
    // When we scroll back past set1, jump forward to set2→set3 boundary
    const wrap = () => {
        if (oneSetWidth <= 0) return;
        // Scrolled too far left (past set2 into set3)
        if (pos <= -oneSetWidth * 2) {
            pos += oneSetWidth;
        }
        // Scrolled too far right (past set2 into set1)
        if (pos > 0) {
            pos -= oneSetWidth;
        }
    };
    
    // Animation loop
    const tick = () => {
        if (!isDragging) {
            if (Math.abs(velocity) > 0.3) {
                pos += velocity;
                velocity *= MOMENTUM_FRICTION;
            } else if (!isPaused) {
                pos -= SPEED;
                velocity = 0;
            }
        }
        
        wrap();
        setPos(pos);
        animId = requestAnimationFrame(tick);
    };
    
    const pause = () => {
        isPaused = true;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
            isPaused = false;
            galleryMarquee?.classList.remove('gallery-paused');
        }, RESUME_DELAY);
    };
    
    // --- Pointer Events ---
    galleryTrack.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        isTap = true;
        pointerId = e.pointerId;
        startX = lastX = e.clientX;
        startY = e.clientY;
        lastTime = Date.now();
        dragStartPos = pos;
        velocity = 0;
        isPaused = true;
        clearTimeout(resumeTimer);
        galleryTrack.classList.add('is-dragging');
        galleryMarquee?.classList.add('gallery-paused');
        e.preventDefault();
    });
    
    document.addEventListener('pointermove', (e) => {
        if (!isDragging || e.pointerId !== pointerId) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const now = Date.now();
        const dt = Math.max(now - lastTime, 1);
        
        // Let go if user is scrolling vertically
        if (isTap && Math.abs(dy) > Math.abs(dx) * 2 && Math.abs(dy) > 10) {
            isDragging = false;
            galleryTrack.classList.remove('is-dragging');
            isPaused = false;
            return;
        }
        
        if (Math.abs(dx) > TAP_THRESHOLD) isTap = false;
        
        velocity = (e.clientX - lastX) / dt * 16;
        lastX = e.clientX;
        lastTime = now;
        
        pos = dragStartPos + dx;
        wrap();
        setPos(pos);
    });
    
    document.addEventListener('pointerup', (e) => {
        if (!isDragging || e.pointerId !== pointerId) return;
        isDragging = false;
        pointerId = null;
        galleryTrack.classList.remove('is-dragging');
        if (!isTap) {
            velocity *= 1.2;
            pause();
        } else {
            isPaused = false;
            galleryMarquee?.classList.remove('gallery-paused');
        }
    });
    
    document.addEventListener('pointercancel', (e) => {
        if (isDragging && e.pointerId === pointerId) {
            isDragging = false;
            pointerId = null;
            galleryTrack.classList.remove('is-dragging');
            pause();
        }
    });
    
    galleryTrack.addEventListener('click', (e) => {
        if (!isTap) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    
    galleryTrack.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Recalculate on resize
    const recalc = () => { oneSetWidth = galleryTrack.scrollWidth / 3; };
    if (window.ResizeObserver) {
        new ResizeObserver(recalc).observe(galleryTrack);
    }
    window.addEventListener('resize', recalc);
    
    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            if (!animId) animId = requestAnimationFrame(tick);
        } else {
            if (animId) { cancelAnimationFrame(animId); animId = null; }
        }
    });
    
    // Start
    animId = requestAnimationFrame(tick);
}
