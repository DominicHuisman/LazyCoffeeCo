// This file is no longer used.
// Data is now synced directly via Firebase Realtime Database.
// You can safely delete this file and the /api folder.

export default async function handler(req, res) {
    res.status(200).json({ message: 'Data is now managed via Firebase. This endpoint is deprecated.' });
}
