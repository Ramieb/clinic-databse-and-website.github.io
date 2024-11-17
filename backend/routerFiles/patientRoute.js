const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch appointments for a user
router.get('/appointments/:username', (req, res) => {
    const username = req.params.username;

    // Query to fetch upcoming appointments
    const query = `
        SELECT app_date, 
               app_start_time, 
               app_end_time, 
               reason_for_visit, 
               D.first_name AS doctor_first_name, 
               D.last_name AS doctor_last_name, 
               D.specialty AS doctor_specialty
        FROM Appointment
        JOIN Doctor D ON D_ID = D.employee_ssn
        WHERE P_ID = (SELECT patient_id FROM Patient WHERE username = ?)
          AND deleted = FALSE
          AND app_date >= CURDATE() -- Only include upcoming appointments
        ORDER BY app_date, app_start_time; -- Sort by date and time
    `;

    // Execute the query
    db.query(query, [username], (error, results) => {
        if (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({ error: 'Error fetching appointments' });
        } else {
            res.json(results); // Send the results back to the frontend
        }
    });
});

// Add a new appointment
router.post('/appointments', (req, res) => {
    console.log('POST /appointments called with body:', req.body);
    const { username, doctor, appointmentDate, appointmentTime, reason } = req.body;

    // Query to resolve P_ID (patient_id) based on username
    const resolvePatientIdQuery = `SELECT patient_id FROM Patient WHERE username = ?`;

    // Insert query for appointments
    const insertAppointmentQuery = `
        INSERT INTO Appointment (app_date, P_ID, app_start_time, app_end_time, D_ID, reason_for_visit, referral, need_referral)
        VALUES (?, ?, ?, ADDTIME(?, '01:00:00'), ?, ?, NULL, FALSE);
    `;

    db.query(resolvePatientIdQuery, [username], (error, results) => {
        if (error || results.length === 0) {
            res.status(500).json({ error: 'Error resolving patient ID' });
        } else {
            const patientId = results[0].patient_id;

            db.query(
                insertAppointmentQuery,
                [appointmentDate, patientId, appointmentTime, appointmentTime, doctor, reason],
                (error) => {
                    if (error) {
                        res.status(500).json({ error: 'Error creating appointment' });
                    } else {
                        res.json({ success: true });
                    }
                }
            );
        }
    });
});

// Delete an appointment (Soft Delete)
router.delete('/appointments/:id', (req, res) => {
    const appointmentId = req.params.id;
    const query = `UPDATE Appointment SET deleted = TRUE WHERE id = ?`;
    db.query(query, [appointmentId], (error) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting appointment' });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports = router;
