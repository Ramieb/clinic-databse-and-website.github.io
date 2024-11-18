const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection file

app.get('/api/offices', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT location, office_id
             FROM Office`
        );
        res.json(result.rows);  // Return office locations as JSON
    } catch (err) {
        res.status(500).send("Error retrieving office locations");
    }
});
