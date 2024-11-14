const express = require('express');
const router = express.Router();
const db = require('../db');  // Database connection file

// Route to get doctor information based on user ID
router.get('/:id', async (req, res) => {
    const doctorId = req.params.id;

    try {
        const [doctorRows] = await db.query(
            'SELECT * FROM Doctors WHERE id = ?',
            [doctorId]
        );

        if (doctorRows.length > 0) {
            res.json(doctorRows[0]);  // Send doctor info as JSON
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        console.error("Error fetching doctor data:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});  // <-- Closing parenthesis for the router.get('/:id') route

// Route to get all patients
router.get('/patients', async (req, res) => {
    try {
        const [patients] = await db.query('SELECT * FROM Patients');
        res.json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get doctor’s appointments
router.get('/appointments/:doctorId', async (req, res) => {
    const doctorId = req.params.doctorId;

    try {
        const [appointments] = await db.query(
            'SELECT * FROM Appointments WHERE doctor_id = ?',
            [doctorId]
        );
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get a patient's medical records
router.get('/medicalRecords/:patientId', async (req, res) => {
    const patientId = req.params.patientId;

    try {
        const [medicalRecords] = await db.query(
            'SELECT * FROM MedicalRecords WHERE patient_id = ?',
            [patientId]
        );
        res.json(medicalRecords);       
    } catch (error) {
        console.error("Error fetching doctor data:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
