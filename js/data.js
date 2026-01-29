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
        { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop", alt: "Coffee art" },
        { src: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop", alt: "Latte" },
        { src: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop", alt: "Matcha latte" },
        { src: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop", alt: "Coffee cup" },
        { src: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop", alt: "Coffee beans" },
        { src: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400&h=400&fit=crop", alt: "Espresso" }
    ],
    
    // Instagram URL
    instagramUrl: "https://www.instagram.com/lazycoffeeco",
    
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
