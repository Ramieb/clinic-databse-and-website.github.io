const express = require('express');
const router = express.Router();
const db = require('../db');

// router.use(bodyParser.json());

// Route to get appointments for a specific doctor and date
router.get('/getAppointments', async (req, res) => {
    const { employee_ssn, appointmentDate } = req.query;
    
    // Join appointments with patient details using P_ID
    const query = `
        SELECT 
            a.app_start_time, 
            p.patient_id, 
            p.first_name AS patient_first_name, 
            p.last_name AS patient_last_name, 
            a.reason_for_visit
        FROM Appointment a
        JOIN Patient p ON a.P_ID = p.patient_id
        WHERE a.D_ID = ? AND a.app_date = ?
    `;

    try {
        const appointments = await db.query(query, [employee_ssn, appointmentDate]);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to get appointments for a specific doctor and date
router.post('/getAppointments', async (req, res) => {
    const { employee_ssn, appointmentDate } = req.query;
    
    // Join appointments with patient details using P_ID
    const query = `
        SELECT 
            a.app_start_time, 
            p.patient_id, 
            p.first_name AS patient_first_name, 
            p.last_name AS patient_last_name, 
            a.reason_for_visit
        FROM Appointment a
        JOIN Patient p ON a.P_ID = p.patient_id
        WHERE a.D_ID = ? AND a.app_date = ?
    `;

    try {
        const appointments = await db.query(query, [employee_ssn, appointmentDate]);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/getPatients', async (req, res) => {
    try {
        // Query the database to get patients data
        const result = await db.query('SELECT * FROM patients');
        
        // Check if any patients are found
        if (result.rows.length > 0) {
            // Return the patients data as JSON
            res.json(result.rows);
        } else {
            res.status(404).json({ message: 'No patients found' });
        }
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to handle adding a doctor
router.post('/addDoctor', async (req, res) => {
    const { first_name, last_name, phone_number, ssn, specialty, salary, office_id } = req.body;
    const ssn_int = parseInt(ssn, 9);
    const salart_int = parseInt(salary);
    if (!first_name || !last_name || !phone_number || !ssn || !specialty || !salary || !office_id) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Logic to add the doctor to the database
        const query = 'INSERT INTO doctor (first_name, last_name, ssn, specialty, salary, office_id) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [first_name, last_name, ssn_int, specialty, salary_int, office_id];

        // Assuming you have a database connection (e.g., MySQL)
        await db.query(query, values);

        res.status(200).json({ message: 'Doctor added successfully.' });
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ message: 'Failed to add doctor.' });
    }
});

// Endpoint to fetch referral count by doctor for a given time range
router.get('/referral-report-by-doctor', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        return res.status(400).json({ error: 'Valid start and end dates are required.' });
    }

    try {
        const query = `
        SELECT 
            D.first_name AS doctor_first_name, 
            D.last_name AS doctor_last_name, 
            COUNT(*) AS referral_count
        FROM Referral R
        JOIN Doctor D ON R.specialist = D.employee_ssn
        GROUP BY R.specialist
        ORDER BY referral_count DESC;
        `;
        const [referralReport] = await db.query(query, [startDate, endDate]);
        res.json(referralReport);
    } catch (error) {
        console.error("Error fetching referral report:", error.stack);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to fetch salary vs billing for doctors within a time range
router.get('/salary-vs-billing-report', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        return res.status(400).json({ error: 'Valid start and end dates are required.' });
    }

    try {
        const query = `
            SELECT 
                D.first_name AS doctor_name, 
                D.last_name AS doctor_last_name, 
                D.salary,
                COALESCE(SUM(B.total_charge), 0) AS billing_amount
            FROM Doctor D
            LEFT JOIN Billing B ON D.employee_ssn = B.D_ID
            WHERE B.charge_date BETWEEN ? AND ?
            GROUP BY D.employee_ssn
            ORDER BY billing_amount DESC;
        `;
        const [salaryBillingReport] = await db.query(query, [startDate, endDate]);
        res.json(salaryBillingReport);
    } catch (error) {
        console.error("Error fetching salary vs billing report:", error.stack);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getAppointments', (req, res) => {
    // Define the SQL query
    const query = `
        SELECT 
            A.app_date,
            A.app_start_time,
            A.app_end_time,
            A.reason_for_visit,
            A.need_referral,
            D1.first_name AS doctor_first_name,
            D1.last_name AS doctor_last_name,
            D1.employee_ssn AS doctor_id,
            P.first_name AS patient_first_name,
            P.last_name AS patient_last_name,
            P.patient_id AS patient_id
        FROM 
            Appointment A
        JOIN 
            Doctor D1 ON A.D_ID = D1.employee_ssn
        JOIN 
            Patient P ON A.P_ID = P.patient_id;
    `;

        // Execute the query
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching appointments:', err);
                return res.status(500).json({ message: 'Error fetching appointments' });
            }
            // Send the query results as JSON
            res.status(200).json(results);
        });
    });

    // Soft delete an appointment by updating its status to 'deleted'
router.post('/softDelete', (req, res) => {
    const { patient_id, app_date, app_start_time } = req.body;

    // Query to update the appointment's 'deleted' status or use another method (timestamp, etc.)
    const query = `
        UPDATE Appointment
        SET deleted = TRUE  -- Assuming a 'deleted' column is being used
        WHERE P_ID = ? AND app_date = ? AND app_start_time = ?
    `;
    
    db.query(query, [patient_id, app_date, app_start_time], (err, result) => {
        if (err) {
            console.error('Error performing soft delete:', err);
            return res.status(500).json({ success: false, message: 'Failed to delete appointment' });
        }

        res.status(200).json({ success: true, message: 'Appointment marked as deleted' });
    });
});

module.exports = router;
