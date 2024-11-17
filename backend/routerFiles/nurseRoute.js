// routes/patientInfo.js

const express = require('express');
const db = require('../db'); // Import your database connection
const router = express.Router();

// Endpoint to get patient information
router.get('/get-patient-info/:patientId', async (req, res) => {
    const { patientId } = req.params;

    // Query to get patient details by patient ID
    const query = `
        SELECT first_name, last_name, date_of_birth, gender, ailment, medicine, procedure_done, vaccine, allergy
        FROM Patient, Medication, Allergies, Immunization, Surgery, Illness
        WHERE patient_id = ?
    `;
    
    try {
        const [rows] = await db.query(query, [patientId]);

        // Check if patient exists
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Send patient details as response
        res.json(rows[0]);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Error fetching patient information from the database' });
    }
});

// Endpoint to update patient information
router.post('/update-patient-info', async (req, res) => {
    const { patientId, first_name, last_name, dob, age, gender, illnesses, surgicalHistory, immunizations, medications, allergies } = req.body;

    // Query to update patient details
    const query = `
        UPDATE Medication, Allergies, Immunization, Surgery, Illness
        SET ailment = ?, procedure_done = ?, vaccine = ?, medicine = ?, allergy = ?
        WHERE patient_id = ?
    `;

    try {
        const [result] = await db.query(query, [
            first_name, last_name, dob, age, gender, illnesses, surgicalHistory, immunizations, medications, allergies, patientId
        ]);

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Respond with success
        res.json({ message: 'Patient information updated successfully' });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Error updating patient information in the database' });
    }
});

router.get('/appointment', async (req, res) => {
    const { patientId, startDate, endDate, firstName, lastName } = req.query;

    let query = `
        SELECT first_name, last_name, app_date, D_ID
        FROM Appointment, Patient
        WHERE 1=1
    `;

    const params = [];

    if (patientId) {
        query += ' AND patient_id = ?';
        params.push(patientId);
    }
    if (firstName) {
        query += ' AND first_name LIKE ?';
        params.push(`%${firstName}%`);
    }
    if (lastName) {
        query += ' AND last_name LIKE ?';
        params.push(`%${lastName}%`);
    }
    if (startDate) {
        query += ' AND appointment_date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND appointment_date <= ?';
        params.push(endDate);
    }

    try {
        const [rows] = await db.query(query, params);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No appointments found' });
        }

        res.json(rows);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Error fetching appointments from the database' });
    }
});

// Endpoint to get details of a specific appointment
router.get('/appointment/:app_date', async (req, res) => {
    const { appointmentId } = req.params;

    const query = `
        SELECT * FROM Appointment
        WHERE app_date = ?
    `;

    try {
        const [rows] = await db.query(query, [appointmentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Error fetching appointment details' });
    }
});

// Endpoint to update an appointment
router.put('/appointment/:app_date', async (req, res) => {
    const { appointmentId } = req.params;
    const { weight, height, bloodPressure, temperature, doctorNotes } = req.body;

    const query = `
        UPDATE Appointment, Med_History
        SET weight = ?, height = ?, blood_pressure = ?, temperature = ?, nurse_notes = ?
        WHERE app_date = ?
    `;

    try {
        const [result] = await db.query(query, [weight, height, bloodPressure, temperature, doctorNotes, appointmentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Error updating appointment' });
    }
});

module.exports = router; // Export the router

