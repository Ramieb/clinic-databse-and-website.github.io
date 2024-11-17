const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection file

// Route to get all doctors for dropdowns or general listing
router.get('/getDoctors', async (req, res) => {
    try {
        const [doctors] = await db.query(`
            SELECT 
                D.employee_ssn, 
                D.first_name, 
                D.last_name, 
                D.specialty, 
                D.specialist, 
                D.cost, 
                O.location
            FROM Doctor D
            LEFT JOIN Office O ON D.office_id = O.office_id;
        `);

        res.json(doctors); // Return the list of doctors as JSON
    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get appointments for a specific doctor and date
router.get('/getAppointments', async (req, res) => {
    const patientId = req.query.patientId;

    try {
        const [appointments] = await db.query(
            `
            SELECT 
                A.app_date, 
                A.app_start_time, 
                A.app_end_time, 
                D.first_name AS doctor_first, 
                D.last_name AS doctor_last, 
                A.reason_for_visit
            FROM Appointment A
            JOIN Doctor D ON A.D_ID = D.employee_ssn
            WHERE A.P_ID = ?;
            `,
            [patientId]
        );

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get doctor information based on user ID
router.get('/:id', async (req, res) => {
    const doctorId = req.params.id;

    try {
        const [doctorRows] = await db.query(
            'SELECT * FROM Doctors WHERE id = ?',
            [doctorId]
        );

        if (doctorRows.length > 0) {
            res.json(doctorRows[0]); // Send doctor info as JSON
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        console.error("Error fetching doctor data:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get doctor’s appointments
router.get('/appointmentsbydoctor/:doctorId', async (req, res) => {
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

// Route to get doctor-patient history
router.get('/doctor_patient_history', async (req, res) => {
    try {
        // Query the doctor_patient_history view
        const [rows] = await db.query('SELECT * FROM doctor_patient_history');
        
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Error fetching doctor-patient history:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching doctor-patient history"
        });
    }
});

// Endpoint to fetch referral count by doctor for a given time range
router.get('/referral-report-by-doctor', (req, res) => {
    const { startDate, endDate } = req.query;
    // Validate date range
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start and end date are required.' });
    }
    // Query to fetch referral count by doctor
    const query = `
        SELECT 
            D.first_name AS doctorName, 
            COUNT(R.id) AS referralCount
        FROM Referral R
        JOIN Doctor D ON R.doctor_id = D.id
        WHERE R.date >= ? AND R.date <= ?
        GROUP BY D.id
        ORDER BY referralCount DESC;
    `;
    connection.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
// Endpoint to fetch salary vs billing for doctors within a time range
router.get('/salary-vs-billing-report', (req, res) => {
    const { startDate, endDate } = req.query;
    // Validate date range
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start and end date are required.' });
    }
    // Query to fetch salary vs billing for doctors
    const query = `
        SELECT 
            D.first_name AS doctorName, 
            D.salary AS salary,
            SUM(B.amount) AS billingAmount
        FROM Doctor D
        JOIN Billing B ON D.id = B.doctor_id
        WHERE B.date >= ? AND B.date <= ?
        GROUP BY D.id
        ORDER BY billingAmount DESC;
    `;
    connection.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
