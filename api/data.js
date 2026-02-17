// Vercel Serverless Function - Proxies data sync to JSONBlob
// This bypasses browser CORS restrictions

const JSONBLOB_ID = '019c691d-ea42-75ab-add3-ac3702e7243b';
const JSONBLOB_URL = `https://jsonblob.com/api/jsonBlob/${JSONBLOB_ID}`;

export default async function handler(req, res) {
    // Set CORS headers for browser requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Fetch data from JSONBlob
            const response = await fetch(JSONBLOB_URL);
            const data = await response.json();
            return res.status(200).json(data);
        }

        if (req.method === 'PUT') {
            // Save data to JSONBlob
            const response = await fetch(JSONBLOB_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body)
            });

            if (response.ok) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(500).json({ error: 'Failed to save to cloud' });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: error.message });
    }
}
