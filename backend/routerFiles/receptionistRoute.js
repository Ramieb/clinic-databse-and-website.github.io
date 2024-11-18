const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is a module that exports the query function

//////////////////APPOINTMENT BACKEND//////////////////////
// Define the route to get office locations
router.get('/offices', async (_, res) => {
    try {
        const [result] = await db.query(
            `SELECT location, office_id FROM Office`
        );
        res.json(result);  // Return office locations as JSON
    } catch (err) {
        console.error("Error retrieving office locations:", err);
        res.status(500).json({ message: 'Error retrieving office locations' });
    }
});

// Find the appointments for location and date
router.post('/appointments', async (req, res) => {
    const { office_id, date, doctor } = req.body;  // Received date and office (doctor)

    // Validate inputs
    if (!date || !office_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Date and office location are required.'
        });
    }

    // Base query
    let query = `
        SELECT 
            Patient.patient_id,
            Patient.first_name AS patient_first_name,
            Patient.last_name AS patient_last_name,
            Doctor.employee_ssn,
            Doctor.first_name AS doctor_first_name,
            Doctor.last_name AS doctor_last_name, 
            app_date, app_start_time, reason_for_visit, 
            Office.location AS app_location
        FROM Appointment
        JOIN Patient ON Appointment.P_ID = Patient.patient_id
        JOIN Doctor ON Doctor.employee_ssn = Appointment.D_ID
        JOIN Office ON Office.office_id = Appointment.office_location
        WHERE Appointment.app_date = ? 
        AND Office.office_id = ?`;

    // Add doctor filter if doctor_id is provided
    if (doctor) {
        query += ` AND Appointment.D_ID = ?`;
    }

    try {
        // Query to find available appointment slots for the given office_id, date, and optional doctor_id
        const params = doctor ? [date, office_id, doctor] : [date, office_id];  // Build params based on doctor_id presence
        const [result] = await db.query(query, params);

        if (result.length > 0) {
            res.json({
                status: 'success',
                appointments: result
            });
        } else {
            res.json({
                status: 'error',
                message: 'No available appointments for this date and location.'
            });
        }
    } catch (err) {
        console.error('Error checking appointments:', err);
        res.status(500).json({
            status: 'error',
            message: 'Error checking appointments. Please try again later.'
        });
    }
});
/*
// Delete appointments
router.delete('/appointments', async (req, res) => {
    const { patientId, appDate, appStartTime } = req.body;

    try {
        // Perform the deletion logic using patientId, appDate, and appStartTime
        const [result] = await db.query(
            'DELETE FROM Appointment WHERE P_ID = ? AND app_date = ? AND app_start_time = ?',
            [patientId, appDate, appStartTime]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Appointment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});*/
/////////////////////////////////////////////
/*
///////////////REGISTER BACKEND/////////////////////////
// POST route to handle patient registration
router.post('/register', async (req, res) => {
    const { 
        first_name, last_name, dob, 
        address, phone_number, role 
    } = req.body;

    // Validate the incoming data
    if (!first_name || !last_name || !dob || !phone_number || !role || !address) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields.'
        });
    }

    // Generate the username (phone_number) and password (last_name + phone number)
    const username = phone_number; // Using phone number as the username
    const password = last_name + phone_number; // Password = last name + phone number
    
    // Begin a transaction to ensure atomicity (both inserts must succeed or fail together)
    try {
        await db.query('START TRANSACTION');  // Start a transaction

        const [result] = await db.query('SELECT COALESCE(MAX(patient_id), 0) + 1 AS next_patient_id FROM Patient');
        const patient_id = result[0].next_patient_id;

        // Insert the new user into the Users table
        await db.query(
            'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
            [username, password, role]
        );

        // Insert the new patient into the Patient table
        await db.query(
            `INSERT INTO Patient (
                patient_id, username, first_name, last_name, date_of_birth, address, 
                phone_number, primary_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [patient_id, username, first_name, last_name, dob, address, phone_number, null]
        );

        // Commit the transaction
        await db.query('COMMIT');
        
        // Return a success response
        res.status(200).json({
            status: 'success',
            message: 'Registration successful! Your temporary username is your phone number and password is your last name + phone number',
            patient_id: patient_id
        });
    } catch (err) {
        // If there's any error, rollback the transaction
        await db.query('ROLLBACK');
        console.error("Error registering patient:", err);
        res.status(500).json({
            status: 'error',
            message: 'Registration failed. Please try again later.'
        });
    }
});
/////////////////////////////////////////

/////////////////BILLING BACKEND////////////////////
router.post('/billing_id_lookup', async (req, res) => {
    const { patient_id } = req.body;

    try {
        const [result] = await db.query(
            `SELECT P.patient_id, P.first_name, P.last_name,
                    B.charge_for, B.total_charged, B.total_paid, B.charge_date
            FROM Patient AS P
            JOIN Billing AS B ON P.patient_id = B.P_ID
            WHERE B.paid_off = FALSE AND B.P_ID = ?`,
            [patient_id]
        );
        res.json(result);  // Return billing details as JSON
    } catch (err) {
        console.error("Error retrieving outstanding bills:", err);
        res.status(500).json({ message: 'Error retrieving outstanding bills' });
    }
});

router.post('/billing_alt_lookup', async (req, res) => {
    const { patient_last_name, patientDOB } = req.body;

    try {
        const [result] = await db.query(
            `SELECT P.patient_id, P.first_name, P.last_name,
                    B.charge_for, B.total_charged, B.total_paid, B.charge_date
            FROM Patient AS P, Billing AS B
            WHERE B.paid_off = FALSE AND P.last_name = ? AND P.date_of_birth = ?
                AND P.patient_id = B.P_ID`,
            [patient_last_name, patientDOB]
        );
        res.json(result);  // Return billing details as JSON
    } catch (err) {
        console.error("Error retrieving outstanding bills:", err);
        res.status(500).json({ message: 'Error retrieving outstanding bills' });
    }
});
/////////////////////////////////////////////
*/
module.exports = router;
