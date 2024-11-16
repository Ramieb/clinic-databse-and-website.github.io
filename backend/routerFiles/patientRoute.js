const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/appointments/:username', (req, res) => {
    const username = req.params.username;
    const query = `SELECT * FROM Appointment WHERE username = ?`;
    db.query(query, [username], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching appointments' });
        } else {
            res.json(results);
        }
    });
});

router.post('/appointments', (req, res) => {
    const { username, doctor, appointmentDate, appointmentTime, reason } = req.body;
    const query = `INSERT INTO Appointment (username, doctor, app_date, app_start_time, reason_for_visit) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [username, doctor, appointmentDate, appointmentTime, reason], (error) => {
        if (error) {
            res.status(500).json({ error: 'Error creating appointment' });
        } else {
            res.json({ success: true });
        }
    });
});

router.delete('/appointments/:id', (req, res) => {
    const appointmentId = req.params.id;
    const query = `DELETE FROM Appointment WHERE id = ?`;
    db.query(query, [appointmentId], (error) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting appointment' });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports = router;
