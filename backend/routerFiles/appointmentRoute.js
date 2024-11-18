// routes/appointments.js

const express = require('express');
const db = require('../db'); // Import your database connection
const router = express.Router();

// Reason-to-Doctor mapping (example, adjust as necessary)
const reasonToDoctorMap = {
    'General Checkup': 1,
    'Dental Checkup': 2,
    'Skin Consultation': 3,
};

// Endpoint to get available times
router.post('/get-available-times', async (req, res) => {
    const { date, reason } = req.body;
    const doctorId = reasonToDoctorMap[reason]; // Get the doctor ID based on the reason

    // Query to find available slots for that date and doctor
    const query = `
        SELECT time FROM appointments 
        WHERE date = ? AND doctor_id = ? AND booked = false
    `;
    try {
        const [availableTimes] = await db.query(query, [date, doctorId]);
        res.json(availableTimes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching available times' });
    }
});

module.exports = router; // Export the router