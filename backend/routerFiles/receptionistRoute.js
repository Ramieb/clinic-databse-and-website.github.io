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

module.exports = router;
