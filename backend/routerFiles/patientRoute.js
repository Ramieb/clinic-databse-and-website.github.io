const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch upcoming appointments for a user
router.get('/appointments/:username', async (req, res) => {
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

    try {
        const [results] = await db.query(query, [username]);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching appointments:', error.stack);
        res.status(500).json({ error: 'Error fetching appointments' });
    }
});

// Add a new appointment
router.post('/appointments', async (req, res) => {
    const { username, doctor, appointmentDate, appointmentTime, reason } = req.body;

    if (!username || !doctor || !appointmentDate || !appointmentTime || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const resolvePatientIdQuery = `SELECT patient_id FROM Patient WHERE username = ?`;
    const validateReferralQuery = `
        SELECT * FROM Referral 
        WHERE P_ID = ? AND specialist = ? AND doc_appr = TRUE AND expiration >= CURDATE();
    `;

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

    try {
        // Resolve patient ID from username
        const [patientResults] = await db.query(resolvePatientIdQuery, [username]);
        if (patientResults.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const patientId = patientResults[0].patient_id;

        // Validate referral
        const [referralResults] = await db.query(validateReferralQuery, [patientId, doctor]);
        if (referralResults.length === 0) {
            return res.status(400).json({ error: 'No valid referral found for this specialist.' });
        }

        // Insert appointment
        await db.query(insertAppointmentQuery, [appointmentDate, patientId, appointmentTime, appointmentTime, doctor, reason]);
        res.status(201).json({ success: true, message: 'Appointment created successfully' });

    } catch (error) {
        console.error('Error creating appointment:', error.stack);
        res.status(500).json({ error: 'Error creating appointment' });
    }
});

// Fetch all patients (renamed to match '/api/getPatients')
router.get("/getPatients", async (req, res) => {
    try {
        const [patients] = await db.query("SELECT * FROM Patient");
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error.stack);
        res.status(500).send("Error fetching patients.");
    }
});

// Fetch medications for a patient
router.get("/medications/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [medications] = await db.query("SELECT * FROM Medication WHERE P_ID = ?", [id]);
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error.stack);
        res.status(500).send("Error fetching medications.");
    }
});

// Fetch appointments for a patient
router.get("/appointments/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [appointments] = await db.query("SELECT * FROM Appointment WHERE P_ID = ?", [id]);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error.stack);
        res.status(500).send("Error fetching appointments.");
    }
});

// Delete a patient
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM Patient WHERE patient_id = ?", [id]);
        res.sendStatus(204); // No Content
    } catch (error) {
        console.error('Error deleting patient:', error.stack);
        res.status(500).send("Error deleting patient.");
    }
});

// Route to get referrals for a specific doctor
router.get('/getReferrals', async (req, res) => {
    const doctorId = req.query.specialist;

    if (!doctorId) {
        return res.status(400).json({ message: 'Doctor ID is required.' });
    }

    try {
        const query = `
            SELECT 
                R.referral_id,
                P.first_name AS patient_first_name,
                P.last_name AS patient_last_name,
                R.reason_for_referral,
                R.status,
                R.ref_date
            FROM Referral R
            JOIN Patient P ON R.P_ID = P.patient_id
            WHERE R.specialist = ?;
        `;
        const [referrals] = await db.query(query, [doctorId]);
        res.status(200).json(referrals);
    } catch (error) {
        console.error('Error fetching referrals:', error.stack);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
