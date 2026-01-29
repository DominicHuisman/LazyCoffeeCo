/* ===================================
   Lazy Coffee Co. - Site Data
   This file stores all dynamic content
   that can be edited via the admin portal
   =================================== */

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
            time: "10:00 AM - 2:00 PM",
            directionsUrl: "https://maps.google.com"
        },
        {
            id: 2,
            day: "Friday",
            location: "Boca Farmers Market",
            time: "8:00 AM - 1:00 PM",
            directionsUrl: "https://maps.google.com"
        },
        {
            id: 3,
            day: "Saturday",
            location: "Delray Beach",
            time: "9:00 AM - 12:00 PM",
            directionsUrl: "https://maps.google.com"
        }
    ],
    
    // Testimonials
    testimonials: [
        "Best matcha in town!",
        "Amazing service, our guests loved it!",
        "Perfect for any special event!"
    ],
    
    // Gallery Images
    gallery: [
        // Add image paths here
        // { src: "images/gallery/photo1.jpg", alt: "Coffee photo" }
    ],
    
    // Business Info
    business: {
        name: "Lazy Coffee Co.",
        tagline: "Premium coffee + ceremonial matcha pop-ups across South Florida.",
        instagram: "https://instagram.com/lazycoffeeco",
        email: "hello@lazycoffeeco.com",
        phone: ""
    },
    
    // CRM Webhook URL (for form submissions)
    crmWebhookUrl: "",
    
    // Calendly URL (for booking integration)
    calendlyUrl: ""
};

// Function to save data to localStorage
function saveData(data) {
    localStorage.setItem('lazyCoffeeData', JSON.stringify(data));
}

// Function to load data from localStorage
function loadData() {
    const stored = localStorage.getItem('lazyCoffeeData');
    if (stored) {
        return JSON.parse(stored);
    }
    // If no stored data, save default and return it
    saveData(siteData);
    return siteData;
}

// Function to get current data
function getData() {
    return loadData();
}

// Function to update specific section
function updateSection(section, data) {
    const currentData = loadData();
    currentData[section] = data;
    saveData(currentData);
    return currentData;
}

// Initialize data on first load
if (!localStorage.getItem('lazyCoffeeData')) {
    saveData(siteData);
}
