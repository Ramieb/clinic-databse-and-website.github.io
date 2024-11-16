const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch appointments for a user
router.get('/appointments/:username', (req, res) => {
    const username = req.params.username;
    const query = `
        SELECT A.id, A.app_date, A.app_start_time, A.reason_for_visit, D.first_name AS doctor_first_name, D.last_name AS doctor_last_name, D.specialty AS doctor_specialty
        FROM Appointment A
        JOIN Doctor D ON A.D_ID = D.employee_ssn
        WHERE A.P_ID = (SELECT patient_id FROM Patient WHERE username = ?) AND A.deleted = FALSE;
    `;
    db.query(query, [username], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching appointments' });
        } else {
            res.json(results);
        }
    });
});

// Add a new appointment
router.post('/appointments', (req, res) => {
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
