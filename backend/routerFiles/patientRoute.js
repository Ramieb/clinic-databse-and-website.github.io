const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch upcoming appointments for a user
router.get('/appointments/:username', (req, res) => {
    const username = req.params.username;

    const query = `
        SELECT 
            Appointment.app_date, 
            Appointment.app_start_time, 
            Appointment.app_end_time, 
            Appointment.reason_for_visit, 
            Doctor.first_name AS doctor_first_name, 
            Doctor.last_name AS doctor_last_name, 
            Doctor.specialty AS doctor_specialty
        FROM Appointment
        JOIN Doctor ON Appointment.D_ID = Doctor.employee_ssn
        JOIN Patient ON Appointment.P_ID = Patient.patient_id
        WHERE Patient.username = ?
        AND Appointment.app_date >= CURDATE()
        ORDER BY Appointment.app_date, Appointment.app_start_time;
    `;

    console.log('Fetching appointments for username:', username);

    db.query(query, [username], (error, results) => {
        if (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({ error: 'Error fetching appointments' });
        } else {
            console.log('Fetched appointments:', results);
            res.status(200).json(results);
        }
    });
});

// Add a new appointment
router.post('/appointments', (req, res) => {
    const { username, doctor, appointmentDate, appointmentTime, reason } = req.body;

    if (!username || !doctor || !appointmentDate || !appointmentTime || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const resolvePatientIdQuery = `SELECT patient_id FROM Patient WHERE username = ?`;

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
            (insertError) => {
                if (insertError) {
                    console.error('Error creating appointment:', insertError);
                    res.status(500).json({ error: 'Error creating appointment' });
                } else {
                    res.status(201).json({ success: true, message: 'Appointment created successfully' });
                }
            }
        );
    });
});

module.exports = router;
