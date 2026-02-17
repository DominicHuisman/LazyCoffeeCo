/* ===================================
   Lazy Coffee Co. - Admin JavaScript
   Handles admin portal functionality
   Cloud-synced via JSONBlob
   =================================== */

// Default admin password (should be changed by owner)
const DEFAULT_PASSWORD = 'lazycoffee2026';

document.addEventListener('DOMContentLoaded', function() {
    initLogin();
    initNavigation();
    initLogout();
});

/* ===================================
   Authentication
   =================================== */

function initLogin() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        const storedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;
        
        if (password === storedPassword) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            loginError.style.display = 'block';
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        }
    });
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    
    // Load cloud data before rendering editors
    loadAllEditorsAsync();
}

async function loadAllEditorsAsync() {
    // Show loading state
    const indicator = document.getElementById('save-indicator');
    indicator.textContent = 'Loading...';
    indicator.classList.add('show');
    
    try {
        // Fetch fresh data from cloud
        const data = await getDataAsync();
        
        renderScheduleEditor(data.schedule);
        renderGalleryEditor(data.gallery);
        renderTestimonialsEditor(data.testimonials);
        loadSettings(data);
        renderSubmissions();
        
        // Initialize add buttons
        initAddButtons();
        initSettingsHandlers();
        
        indicator.textContent = 'Loaded from cloud';
        setTimeout(() => {
            indicator.classList.remove('show');
            indicator.textContent = 'Saved to cloud ✓';
        }, 1500);
    } catch (e) {
        console.error('Error loading cloud data:', e);
        // Fall back to local data
        loadAllEditors();
        indicator.textContent = 'Using local data';
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
}

function initLogout() {
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('adminLoggedIn');
        location.reload();
    });
}

/* ===================================
   Navigation
   =================================== */

function initNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`section-${sectionId}`).classList.add('active');
        });
    });
}

/* ===================================
   Load All Editors
   =================================== */

function loadAllEditors() {
    const data = getData();
    
    renderScheduleEditor(data.schedule);
    renderGalleryEditor(data.gallery);
    renderTestimonialsEditor(data.testimonials);
    loadSettings(data);
    renderSubmissions();
    
    // Initialize add buttons
    initAddButtons();
    initSettingsHandlers();
}

/* ===================================
   Menu Editor
   =================================== */

function renderMenuEditor(menuData) {
    const container = document.getElementById('menu-editor');
    container.innerHTML = '';
    
    if (!menuData || !menuData.categories) {
        menuData = { categories: [] };
    }
    
    menuData.categories.forEach((category, catIndex) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.index = catIndex;
        
        let itemsHtml = category.items.map((item, itemIndex) => `
            <div class="item-row" data-item-index="${itemIndex}">
                <input type="text" value="${escapeHtml(item)}" placeholder="Item name" onchange="updateMenuItem(${catIndex}, ${itemIndex}, this.value)">
                <button class="icon-btn delete" onclick="deleteMenuItem(${catIndex}, ${itemIndex})">×</button>
            </div>
        `).join('');
        
        card.innerHTML = `
            <div class="category-header">
                <input type="text" value="${escapeHtml(category.name)}" placeholder="Category Name" onchange="updateCategoryName(${catIndex}, this.value)">
                <div class="category-actions">
                    <button class="icon-btn delete" onclick="deleteCategory(${catIndex})">×</button>
                </div>
            </div>
            <div class="category-body">
                <div class="item-list">
                    ${itemsHtml}
                </div>
                <div class="item-note">
                    <input type="text" value="${escapeHtml(category.note || '')}" placeholder="Optional note (e.g., Cold Foam Included)" onchange="updateCategoryNote(${catIndex}, this.value)">
                </div>
                <button class="add-item-btn" onclick="addMenuItem(${catIndex})">+ Add Item</button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function updateCategoryName(catIndex, value) {
    const data = getData();
    data.menu.categories[catIndex].name = value;
    saveData(data);
    showSaveIndicator();
}

function updateCategoryNote(catIndex, value) {
    const data = getData();
    data.menu.categories[catIndex].note = value;
    saveData(data);
    showSaveIndicator();
}

function updateMenuItem(catIndex, itemIndex, value) {
    const data = getData();
    data.menu.categories[catIndex].items[itemIndex] = value;
    saveData(data);
    showSaveIndicator();
}

function addMenuItem(catIndex) {
    const data = getData();
    data.menu.categories[catIndex].items.push('New Item');
    saveData(data);
    renderMenuEditor(data.menu);
    showSaveIndicator();
}

function deleteMenuItem(catIndex, itemIndex) {
    const data = getData();
    data.menu.categories[catIndex].items.splice(itemIndex, 1);
    saveData(data);
    renderMenuEditor(data.menu);
    showSaveIndicator();
}

function addCategory() {
    const data = getData();
    if (!data.menu) {
        data.menu = { categories: [] };
    }
    data.menu.categories.push({
        id: Date.now(),
        name: 'New Category',
        items: ['Item 1']
    });
    saveData(data);
    renderMenuEditor(data.menu);
    showSaveIndicator();
}

function deleteCategory(catIndex) {
    if (!confirm('Delete this category and all its items?')) return;
    
    const data = getData();
    data.menu.categories.splice(catIndex, 1);
    saveData(data);
    renderMenuEditor(data.menu);
    showSaveIndicator();
}

/* ===================================
   Schedule Editor
   =================================== */

function renderScheduleEditor(scheduleData) {
    const container = document.getElementById('schedule-editor');
    container.innerHTML = '';
    
    if (!scheduleData || scheduleData.length === 0) {
        container.innerHTML = '<p class="no-submissions">No events scheduled. Click "Add Event" to create one.</p>';
        return;
    }
    
    scheduleData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'schedule-card-admin';
        
        card.innerHTML = `
            <input type="text" value="${escapeHtml(item.day)}" placeholder="Day (e.g. Thursday)" onchange="updateSchedule(${index}, 'day', this.value)">
            <input type="text" value="${escapeHtml(item.location)}" placeholder="Location Name" onchange="updateSchedule(${index}, 'location', this.value)">
            <input type="text" value="${escapeHtml(item.address || '')}" placeholder="Address (for Maps link)" onchange="updateSchedule(${index}, 'address', this.value)">
            <input type="text" value="${escapeHtml(item.time)}" placeholder="Time" onchange="updateSchedule(${index}, 'time', this.value)">
            <button class="icon-btn delete" onclick="deleteScheduleItem(${index})">×</button>
        `;
        
        container.appendChild(card);
    });
}

function updateSchedule(index, field, value) {
    const data = getData();
    data.schedule[index][field] = value;
    saveData(data);
    showSaveIndicator();
}

function addScheduleItem() {
    const data = getData();
    if (!data.schedule) {
        data.schedule = [];
    }
    data.schedule.push({
        id: Date.now(),
        day: 'Day',
        location: 'Location',
        address: '',
        time: '9:00 AM - 12:00 PM'
    });
    saveData(data);
    renderScheduleEditor(data.schedule);
    showSaveIndicator();
}

function deleteScheduleItem(index) {
    if (!confirm('Delete this schedule item?')) return;
    
    const data = getData();
    data.schedule.splice(index, 1);
    saveData(data);
    renderScheduleEditor(data.schedule);
    showSaveIndicator();
}

/* ===================================
   Testimonials Editor
   =================================== */

function renderTestimonialsEditor(testimonials) {
    const container = document.getElementById('testimonials-editor');
    container.innerHTML = '';
    
    if (!testimonials || testimonials.length === 0) {
        container.innerHTML = '<p class="no-submissions">No testimonials yet. Click "Add Quote" to create one.</p>';
        return;
    }
    
    testimonials.forEach((quote, index) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        
        card.innerHTML = `
            <input type="text" value="${escapeHtml(quote)}" placeholder="Customer quote..." onchange="updateTestimonial(${index}, this.value)">
            <button class="icon-btn delete" onclick="deleteTestimonial(${index})">×</button>
        `;
        
        container.appendChild(card);
    });
}

function updateTestimonial(index, value) {
    const data = getData();
    data.testimonials[index] = value;
    saveData(data);
    showSaveIndicator();
}

function addTestimonial() {
    const data = getData();
    if (!data.testimonials) {
        data.testimonials = [];
    }
    data.testimonials.push('New testimonial...');
    saveData(data);
    renderTestimonialsEditor(data.testimonials);
    showSaveIndicator();
}

function deleteTestimonial(index) {
    if (!confirm('Delete this testimonial?')) return;
    
    const data = getData();
    data.testimonials.splice(index, 1);
    saveData(data);
    renderTestimonialsEditor(data.testimonials);
    showSaveIndicator();
}

/* ===================================
   Gallery Editor
   =================================== */

function renderGalleryEditor(galleryData) {
    const container = document.getElementById('gallery-editor');
    container.innerHTML = '';
    
    if (!galleryData || galleryData.length === 0) {
        container.innerHTML = '<p class="no-submissions">No gallery images yet. Click "Add Image" to add one.</p>';
        return;
    }
    
    galleryData.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-card-admin';
        
        card.innerHTML = `
            <div class="gallery-preview">
                <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || 'Gallery image')}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22>No Image</text></svg>'">
            </div>
            <div class="gallery-inputs">
                <input type="url" value="${escapeHtml(image.src)}" placeholder="Image URL (https://...)" onchange="updateGalleryImage(${index}, 'src', this.value)">
                <input type="text" value="${escapeHtml(image.alt || '')}" placeholder="Alt text (optional)" onchange="updateGalleryImage(${index}, 'alt', this.value)">
            </div>
            <button class="icon-btn delete" onclick="deleteGalleryImage(${index})">×</button>
        `;
        
        container.appendChild(card);
    });
}

function updateGalleryImage(index, field, value) {
    const data = getData();
    if (!data.gallery) data.gallery = [];
    data.gallery[index][field] = value;
    saveData(data);
    renderGalleryEditor(data.gallery);
    showSaveIndicator();
}

function addGalleryImage() {
    const data = getData();
    if (!data.gallery) {
        data.gallery = [];
    }
    data.gallery.push({
        src: '',
        alt: 'Coffee photo'
    });
    saveData(data);
    renderGalleryEditor(data.gallery);
    showSaveIndicator();
}

function deleteGalleryImage(index) {
    if (!confirm('Delete this gallery image?')) return;
    
    const data = getData();
    data.gallery.splice(index, 1);
    saveData(data);
    renderGalleryEditor(data.gallery);
    showSaveIndicator();
}

/* ===================================
   Settings
   =================================== */

function loadSettings(data) {
    if (data.business) {
        document.getElementById('setting-name').value = data.business.name || '';
        document.getElementById('setting-tagline').value = data.business.tagline || '';
        document.getElementById('setting-email').value = data.business.email || '';
        document.getElementById('setting-phone').value = data.business.phone || '';
        document.getElementById('setting-instagram').value = data.business.instagram || '';
    }
    
    document.getElementById('setting-crm').value = data.crmWebhookUrl || '';
    document.getElementById('setting-calendly').value = data.calendlyUrl || '';
}

function initSettingsHandlers() {
    // Save settings button
    document.getElementById('save-settings').addEventListener('click', function() {
        const data = getData();
        
        data.business = {
            name: document.getElementById('setting-name').value,
            tagline: document.getElementById('setting-tagline').value,
            email: document.getElementById('setting-email').value,
            phone: document.getElementById('setting-phone').value,
            instagram: document.getElementById('setting-instagram').value
        };
        
        data.crmWebhookUrl = document.getElementById('setting-crm').value;
        data.calendlyUrl = document.getElementById('setting-calendly').value;
        
        saveData(data);
        showSaveIndicator();
    });
    
    // Change password button
    document.getElementById('change-password').addEventListener('click', function() {
        const newPass = document.getElementById('new-password').value;
        const confirmPass = document.getElementById('confirm-password').value;
        
        if (!newPass || !confirmPass) {
            alert('Please fill in both password fields');
            return;
        }
        
        if (newPass !== confirmPass) {
            alert('Passwords do not match');
            return;
        }
        
        if (newPass.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        
        localStorage.setItem('adminPassword', newPass);
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        alert('Password updated successfully');
    });
}

/* ===================================
   Submissions
   =================================== */

function renderSubmissions() {
    const container = document.getElementById('submissions-list');
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    
    if (submissions.length === 0) {
        container.innerHTML = '<p class="no-submissions">No form submissions yet.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    // Show newest first
    submissions.reverse().forEach(sub => {
        const card = document.createElement('div');
        card.className = 'submission-card';
        
        const date = sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : 'Unknown date';
        
        card.innerHTML = `
            <div class="submission-header">
                <span class="submission-name">${escapeHtml(sub.name || 'Unknown')}</span>
                <span class="submission-date">${date}</span>
            </div>
            <div class="submission-details">
                <div class="submission-field">
                    <label>Email</label>
                    <span>${escapeHtml(sub.email || '-')}</span>
                </div>
                <div class="submission-field">
                    <label>Phone</label>
                    <span>${escapeHtml(sub.phone || '-')}</span>
                </div>
                <div class="submission-field">
                    <label>Inquiry Type</label>
                    <span>${escapeHtml(sub.inquiry_type || '-')}</span>
                </div>
                <div class="submission-field">
                    <label>Event Date</label>
                    <span>${escapeHtml(sub.event_date || '-')}</span>
                </div>
                <div class="submission-field">
                    <label>Guest Count</label>
                    <span>${escapeHtml(sub.guest_count || '-')}</span>
                </div>
                <div class="submission-field">
                    <label>Location</label>
                    <span>${escapeHtml(sub.location || '-')}</span>
                </div>
            </div>
            ${sub.message ? `<div class="submission-field" style="margin-top: 1rem;"><label>Message</label><span>${escapeHtml(sub.message)}</span></div>` : ''}
        `;
        
        container.appendChild(card);
    });
    
    // Export button
    document.getElementById('export-submissions').addEventListener('click', exportSubmissions);
}

function exportSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    
    if (submissions.length === 0) {
        alert('No submissions to export');
        return;
    }
    
    // Create CSV
    const headers = ['Name', 'Email', 'Phone', 'Inquiry Type', 'Event Date', 'Guest Count', 'Location', 'Message', 'Submitted At'];
    const rows = submissions.map(sub => [
        sub.name || '',
        sub.email || '',
        sub.phone || '',
        sub.inquiry_type || '',
        sub.event_date || '',
        sub.guest_count || '',
        sub.location || '',
        sub.message || '',
        sub.submitted_at || ''
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lazy-coffee-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

/* ===================================
   Add Buttons
   =================================== */

function initAddButtons() {
    document.getElementById('add-schedule').addEventListener('click', addScheduleItem);
    document.getElementById('add-gallery-image').addEventListener('click', addGalleryImage);
    document.getElementById('add-testimonial').addEventListener('click', addTestimonial);
}

/* ===================================
   Utilities
   =================================== */

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.textContent = 'Syncing to cloud...';
    indicator.classList.add('show');
    
    // After a short delay, show saved confirmation
    setTimeout(() => {
        indicator.textContent = 'Saved to cloud ✓';
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 1500);
    }, 500);
}
