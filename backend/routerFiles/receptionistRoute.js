const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is a module that exports the query function

//////////////////APPOINTMENT BACKEND//////////////////////
// Define the route to get office locations
router.get('/offices', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT location, office_id FROM Office`
        );
        res.json(result.rows);  // Return office locations as JSON
    } catch (err) {
        console.error("Error retrieving office locations:", err);
        res.status(500).send("Error retrieving office locations");
    }
});

// Find the appointments for location and date
router.post('/appointments', async (req, res) => {
    const { date, office_id } = req.body;  // Received date and office (doctor)

    // Validate inputs
    if (!date || !office_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Date and office location are required.'
        });
    }

    try {
        // Query to find available appointment slots for the given office_id and date
        const result = await db.query(`
            SELECT 
                Patient.patient_id,
                Patient.first_name AS patient_first_name,
                Patient.last_name AS patient_last_name,
                Doctor.employee_ssn,
                Doctor.first_name AS doctor_first_name,
                Doctor.last_name AS doctor_last_name, 
                app_date,app_start_time, reason_for_visit, 
                Office.location AS app_location

            FROM Appointment, Patient, Doctor, Office

            WHERE Appointment.app_date = $1
                AND Office.office_id = $2 AND Appointment.P_ID = Patient.patient_id 
                AND Doctor.employee_ssn = Appointment.D_ID
                AND Appointment.office_location = Office.location`, 
            [date, office_id]
        );

        if (result.rows.length > 0) {
            res.json({
                status: 'success',
                appointments: result.rows
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

// Delete appointments
router.delete('/appointments', async (req, res) => {
    const { patientId, appDate, appStartTime } = req.body;

    try {
        // Perform the deletion logic using patientId, appDate, and appStartTime
        const result = await db.query(
            'DELETE FROM Appointment WHERE P_ID = $1 AND app_date = $2 AND app_start_time = $3',
            [patientId, appDate, appStartTime]
        );

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Appointment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
});
/////////////////////////////////////////////

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

    // Generate the username (phone_number) and password (last_name + zip_code)
    const username = phone_number; // Using phone number as the username
    const password = last_name + phone_number; // Password = last name + phone number
    

    // Begin a transaction to ensure atomicity (both inserts must succeed or fail together)
    try {
        await db.query('BEGIN');  // Start a transaction

        const result = await db.query('SELECT COALESCE(MAX(patient_id), 0) + 1 AS next_patient_id FROM Patient');
        const patient_id = result.rows[0].next_patient_id;

        // Insert the new user into the Users table
        const userResult = await db.query(
            'INSERT INTO Users (username, password, role) VALUES ($1, $2, $3) RETURNING username',
            [username, password, role]
        );

        const userUsername = userResult.rows[0].username;

        // Insert the new patient into the Patient table
        const patientResult = await db.query(
            `INSERT INTO Patient (
                patient_id, username, first_name, last_name, date_of_birth, address, 
                phone_number, primary_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING patient_id`,
            [patient_id, userUsername, first_name, last_name, dob, address, phone_number, null]
        );

        // If both insertions are successful, commit the transaction
        await db.query('COMMIT');
        
        // Return a success response
        res.status(200).json({
            status: 'success',
            message: 'Registration successful! Your temporary username is your phone number and password is your last name + phone number',
            patient_id: patientResult.rows[0].patient_id
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


/////////////////////////////////////////////

module.exports = router;
