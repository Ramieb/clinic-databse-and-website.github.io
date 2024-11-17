const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch upcoming appointments for a user
router.get('/appointments/:username', (req, res) => {
    const username = req.params.username;

    // Query to fetch upcoming appointments
    const query = `
        SELECT 
            app_date, 
            app_start_time, 
            app_end_time, 
            reason_for_visit, 
            D.first_name AS doctor_first_name, 
            D.last_name AS doctor_last_name, 
            D.specialty AS doctor_specialty
        FROM Appointment
        JOIN Doctor D ON Appointment.D_ID = D.employee_ssn
        WHERE Appointment.P_ID = (
            SELECT patient_id 
            FROM Patient 
            WHERE username = ?
        )
          AND Appointment.deleted = FALSE
          AND Appointment.app_date >= CURDATE()
        ORDER BY Appointment.app_date, Appointment.app_start_time;
    `;

    // Execute the query
    db.query(query, [username], (error, results) => {
        if (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({ error: 'Error fetching appointments' });
        } else {
            res.json(results);
        }
    });
});

// Add a new appointment
router.post('/appointments', (req, res) => {
    const { username, doctor, appointmentDate, appointmentTime, reason } = req.body;

    if (!username || !doctor || !appointmentDate || !appointmentTime || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Query to resolve P_ID (patient_id) based on username
    const resolvePatientIdQuery = `
        SELECT patient_id 
        FROM Patient 
        WHERE username = ?
    `;

    // Insert query for appointments
    const insertAppointmentQuery = `
        INSERT INTO Appointment (
            app_date, 
            P_ID, 
            app_start_time, 
            app_end_time, 
            D_ID, 
            reason_for_visit, 
            referral, 
            need_referral
        )
        VALUES (?, ?, ?, ADDTIME(?, '01:00:00'), ?, ?, NULL, FALSE);
    `;

    db.query(resolvePatientIdQuery, [username], (error, results) => {
        if (error || results.length === 0) {
            console.error('Error resolving patient ID:', error);
            return res.status(500).json({ error: 'Could not resolve patient ID' });
        }

        const patientId = results[0].patient_id;

        db.query(
            insertAppointmentQuery,
            [appointmentDate, patientId, appointmentTime, appointmentTime, doctor, reason],
            (error) => {
                if (error) {
                    console.error('Error creating appointment:', error);
                    res.status(500).json({ error: 'Error creating appointment' });
                } else {
                    res.status(201).json({ success: true, message: 'Appointment created successfully' });
                }
            }
        );
    });
});

// Delete an appointment (Soft Delete)
router.delete('/appointments/:id', (req, res) => {
    const appointmentId = req.params.id;

    if (!appointmentId) {
        return res.status(400).json({ error: 'Appointment ID is required' });
    }

    const query = `
        UPDATE Appointment 
        SET deleted = TRUE 
        WHERE P_ID = ?;
    `;

    db.query(query, [appointmentId], (error) => {
        if (error) {
            console.error('Error deleting appointment:', error);
            res.status(500).json({ error: 'Error deleting appointment' });
        } else {
            res.json({ success: true, message: 'Appointment deleted successfully' });
        }
    });
});

// Fetch all patients
router.get('/patients', (req, res) => {
    const query = `
        SELECT patient_id AS id, 
               first_name AS firstName, 
               last_name AS lastName, 
               account_creation_date AS accountCreationDate
        FROM Patient;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching patients:', error);
            res.status(500).json({ error: 'Error fetching patients' });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
