const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is a module that exports the query function

// Define the route to get office locations
router.get('/offices', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT location, office_id FROM Office`
        );
        res.json(result.rows);  // Return office locations as JSON
    } catch (err) {
        console.error("Error retrieving office locations:", err);
        res.status(500).send("Error retrieving office locations");
    }
});

router.post('/appointments', async (req, res) => {
    const { date, office_id } = req.body;  // Received date and office (doctor)

    // Validate inputs
    if (!date || !office_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Date and office location are required.'
        });
    }

    try {
        // Query to find available appointment slots for the given office_id and date
        const result = await db.query(`
            SELECT app_start_time, app_end_time
            FROM Appointment
            WHERE app_date = $1
              AND D_ID = $2
              AND available = true`, 
            [date, office_id]
        );

        if (result.rows.length > 0) {
            res.json({
                status: 'success',
                appointments: result.rows
            });
        } else {
            res.json({
                status: 'error',
                message: 'No available appointments for this date and location.'
            });
        }
    } catch (err) {
        console.error('Error checking appointments:', err);
        res.status(500).json({
            status: 'error',
            message: 'Error checking appointments. Please try again later.'
        });
    }
});

module.exports = router;
