const express = require('express');
const router = express.Router();

// Static routes to serve HTML pages
router.get('/prescriptions', (req, res) => {
    res.sendFile('path/to/prescriptions.html'); // Adjust path accordingly
});

router.get('/billing', (req, res) => {
    res.sendFile('path/to/billing.html'); // Adjust path accordingly
});

router.get('/payment', (req, res) => {
    res.sendFile('path/to/payment.html'); // Adjust path accordingly
});

router.get('/referrals', (req, res) => {
    res.sendFile('path/to/referrals.html'); // Adjust path accordingly
});

module.exports = router;
