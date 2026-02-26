/* ===================================
   Lazy Coffee Co. - Site Data
   Cloud-synced via Firebase Realtime DB
   =================================== */

// ——— Firebase Configuration ———
// TODO: Replace with your own Firebase project config
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Add a Web App
// 4. Copy the config object below
// 5. In Realtime Database → Rules, set:
//    { "rules": { ".read": true, ".write": true } }
//    (You can restrict write later once it's working)

const firebaseConfig = {
    apiKey: "AIzaSyAwSmkDScm8umCzsIRQE__Akzv_xEU1D_o",
    authDomain: "lazy-coffee-co.firebaseapp.com",
    databaseURL: "https://lazy-coffee-co-default-rtdb.firebaseio.com",
    projectId: "lazy-coffee-co",
    storageBucket: "lazy-coffee-co.firebasestorage.app",
    messagingSenderId: "338850573182",
    appId: "1:338850573182:web:b5e51f3c1b3b2e74e0e12f",
    measurementId: "G-FZHRTJMTR8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const dataRef = db.ref('siteData');

// Default data (used on first run / fallback)
const siteData = {
    // Menu Categories
    menu: {
        categories: [
            {
                id: 1,
                name: "Latte",
                items: [
                    "Coconut Latte",
                    "Tiramisu Latte",
                    "Salted Caramel Latte",
                    "Cinnamon Hazelnut Latte"
                ]
            },
            {
                id: 2,
                name: "Matcha",
                items: [
                    "Toasted Vanilla Matcha",
                    "Salted Maple Matcha",
                    "Pistachio Cream Matcha"
                ]
            },
            {
                id: 3,
                name: "Milk Options",
                items: [
                    "Oat Milk",
                    "Almond Milk"
                ],
                note: "Cold Foam Included"
            }
        ]
    },
    
    // Weekly Schedule
    schedule: [
        {
            id: 1,
            day: "Thursday",
            location: "Wynwood Market",
            address: "2250 NW 2nd Ave, Miami, FL 33127",
            time: "10:00 AM - 2:00 PM"
        },
        {
            id: 2,
            day: "Friday",
            location: "Boca Farmers Market",
            address: "Royal Palm Place, Boca Raton, FL 33432",
            time: "8:00 AM - 1:00 PM"
        },
        {
            id: 3,
            day: "Saturday",
            location: "Delray Beach",
            address: "Old School Square, Delray Beach, FL 33444",
            time: "9:00 AM - 12:00 PM"
        }
    ],
    
    // Testimonials
    testimonials: [
        "Best matcha in town!",
        "Amazing service, our guests loved it!",
        "Perfect for any special event!"
    ],
    
    // Gallery Images (URLs that link to Instagram)
    gallery: [
        { src: "https://scontent-mia3-2.cdninstagram.com/v/t51.82787-15/622192788_17881004292452061_2161501484985066730_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=105&ig_cache_key=MzgxODcwMjU3OTM5MjY5NjE4Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEzMjB4MjM0Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=aNgPfjpmeVwQ7kNvwGyFviY&_nc_oc=AdmG9Zwq_KVzM_XqTU3VEXmzKlXSUjm_tC1E1Apcp6xCjRaj87jts4T7oQvnPptvAvY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-mia3-2.cdninstagram.com&_nc_gid=CCKbjdLDcW1tzgeh6oh5uA&oh=00_AftOG4dLfD5z0RjKgXH9SVZ8OhKR0d3QU4hI35v-_HKMxA&oe=69940913", alt: "Lazy Coffee Co" },
        { src: "https://scontent-mia3-3.cdninstagram.com/v/t51.82787-15/614894093_17879381988452061_7612233979836210283_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=109&ig_cache_key=MzgwODYzMjA5Nzg0MjczMjkyMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEzMjB4MjM0Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=z_J3gYVqa_8Q7kNvwFO3CDO&_nc_oc=AdkbcwlfxnpJGwwkhMhuYvCi2WCmp7Cj-2JaSJ5QwcnC7Sft-Ux3if6vKsm2W-pCfUU&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-mia3-3.cdninstagram.com&_nc_gid=CCKbjdLDcW1tzgeh6oh5uA&oh=00_Afs2QW_pB20guyLZb9zo3B6FnqgMYNPIkwOAfIYC5ih3Iw&oe=6993E5D2", alt: "Lazy Coffee Co" },
        { src: "https://scontent-mia3-1.cdninstagram.com/v/t51.82787-15/587114768_17873237079452061_5350831781852465302_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=106&ig_cache_key=Mzc3MDI2OTkxNTcwNzE1NDc3Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEzMjB4MjM0Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=07iFvBKVzPIQ7kNvwG9Fs96&_nc_oc=AdmsL6AJ-W-VtlOcpXWnbl8sCvdIMqZHaogZBHk4NyiAVXw-NSiMER2CHI1kogNYdBs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_gid=CCKbjdLDcW1tzgeh6oh5uA&oh=00_AftFOLNTZSWiOHovFq_hmETGyka8LFM-vZsUOW8j8i9vRg&oe=6993ED45", alt: "Lazy Coffee Co" },
        { src: "https://scontent-mia3-2.cdninstagram.com/v/t51.82787-15/572986973_17871335109452061_4454707225403739749_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=107&ig_cache_key=Mzc1NzIyNTQ4MDE2MTQ0OTgwMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEzMjB4MjM0Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=jBTBEjeH28sQ7kNvwEuG2mj&_nc_oc=AdlfCdZHJ5GVOo1Ql9nnF7iSJKtc_dV5etOg1s9eJ2-tvwZGvqmWM0XqNPZ9sC9Ewww&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-mia3-2.cdninstagram.com&_nc_gid=CCKbjdLDcW1tzgeh6oh5uA&oh=00_AfvE2Pw1AyQZSPUOwBdEfJ2S6FBcO1qSpeP0OZiVmN7VBg&oe=6993E0E5", alt: "Lazy Coffee Co" },
        { src: "https://scontent-mia3-1.cdninstagram.com/v/t51.82787-15/569544515_17870361450452061_872625231341293117_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=106&ig_cache_key=Mzc1MDg1MzUyMjk4NTQwOTY1OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEzMjB4MjM0Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=CcVSVefAXfkQ7kNvwGkrTCJ&_nc_oc=AdlvNyPugkCZgapz1NhmAN6Cr-1ExwD3Lyr_1cyjUQuLu05bz0zCCMlHsm9KqiQRgds&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_gid=CCKbjdLDcW1tzgeh6oh5uA&oh=00_AftXx0CYbO-xkIRk0rjt3hEJDICSe_eiyWEGd4VtfuKr7g&oe=6993F724", alt: "Lazy Coffee Co" }
    ],
    
    // Instagram URL
    instagramUrl: "https://www.instagram.com/lazycoffeeco",
    
    // Business Info
    business: {
        name: "Lazy Coffee Co.",
        tagline: "Premium coffee + ceremonial matcha pop-ups across South Florida.",
        instagram: "https://instagram.com/lazycoffeeco",
        email: "hello@lazycoffeeco.com",
        phone: "(954)-401-2523"
    },
    
    // Pending Reviews (awaiting admin approval)
    pendingReviews: [],

    // CRM Webhook URL (for form submissions)
    crmWebhookUrl: "",
    
    // Calendly URL (for booking integration)
    calendlyUrl: ""
};

// In-memory cache
let cachedData = null;

// ——— Save data to Firebase ———
async function saveDataToCloud(data) {
    try {
        await dataRef.set(data);
        cachedData = JSON.parse(JSON.stringify(data));
        // Also save to localStorage as backup
        localStorage.setItem('lazyCoffeeData', JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        // Fall back to localStorage
        localStorage.setItem('lazyCoffeeData', JSON.stringify(data));
        return false;
    }
}

// ——— Load data from Firebase (one-time read) ———
async function loadDataFromCloud() {
    try {
        const snapshot = await dataRef.once('value');
        const data = snapshot.val();
        if (data) {
            cachedData = data;
            localStorage.setItem('lazyCoffeeData', JSON.stringify(data));
            return data;
        }
    } catch (error) {
        console.error('Error loading from Firebase:', error);
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('lazyCoffeeData');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) { /* ignore parse errors */ }
    }
    
    return siteData;
}

// Synchronous getter (uses cache / localStorage / defaults)
function getData() {
    if (cachedData) {
        return cachedData;
    }
    
    const stored = localStorage.getItem('lazyCoffeeData');
    if (stored) {
        try {
            cachedData = JSON.parse(stored);
            return cachedData;
        } catch (e) { /* ignore */ }
    }
    
    return siteData;
}

// Async getter — fetches fresh from Firebase
async function getDataAsync() {
    return await loadDataFromCloud();
}

// Save function (writes to Firebase + localStorage)
function saveData(data) {
    cachedData = JSON.parse(JSON.stringify(data));
    // Save to localStorage immediately for responsiveness
    localStorage.setItem('lazyCoffeeData', JSON.stringify(data));
    // Then sync to Firebase
    saveDataToCloud(data);
}

// Update a specific section
function updateSection(section, data) {
    const currentData = getData();
    currentData[section] = data;
    saveData(currentData);
    return currentData;
}

// ——— Initialize: load data on page load ———
// If Firebase has no data yet, seed it with defaults
(async function initData() {
    try {
        const snapshot = await dataRef.once('value');
        if (snapshot.val()) {
            cachedData = snapshot.val();
            localStorage.setItem('lazyCoffeeData', JSON.stringify(cachedData));
        } else {
            // First time — push defaults to Firebase
            console.log('No Firebase data found, seeding defaults...');
            await dataRef.set(siteData);
            cachedData = siteData;
            localStorage.setItem('lazyCoffeeData', JSON.stringify(siteData));
        }
    } catch (e) {
        console.log('Firebase unavailable, using local data');
    }
})();
