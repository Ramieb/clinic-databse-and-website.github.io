const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust path if necessary

// Fetch referrals for a specific username
router.get('/api/referrals/:username', (req, res) => {
    const { username } = req.params;
    if (!username) {
        return res.status(400).send('Username is required');
    }

    db.query('SELECT * FROM referrals WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching referrals');
        }
        res.json(results);
    });
});

// Create a new referral
router.post('/api/referrals/:username', (req, res) => {
    const { username } = req.params;
    const { specialist, reason } = req.body;

    if (!username || !specialist || !reason) {
        return res.status(400).send('Missing required fields');
    }

    const query = 'INSERT INTO referrals (username, specialist, reason) VALUES (?, ?, ?)';
    db.query(query, [username, specialist, reason], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating referral');
        }
        res.status(201).send('Referral created successfully');
    });
});

module.exports = router;
