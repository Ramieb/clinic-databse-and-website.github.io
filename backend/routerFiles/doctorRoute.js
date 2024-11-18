const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection file

// Route to get all doctors
router.get('/getDoctors', async (_, res) => {
    try {
        const query = `
            SELECT 
                D.employee_ssn, 
                D.username,
                D.Admin_ssn,
                D.first_name, 
                D.last_name, 
                D.hire_date, 
                D.salary, 
                D.office_id, 
                D.specialty, 
                D.specialist, 
                D.cost
            FROM Doctor D;
        `;
        const [doctors] = await db.query(query);
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get appointments for a specific doctor
router.get('/getAppointments', async (req, res) => {
    const doctorId = req.query.doctorId;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required.' });
    }

    try {
        const query = `
            SELECT 
                A.app_date, 
                A.app_start_time, 
                A.app_end_time, 
                A.reason_for_visit,
                P.first_name AS patient_first_name,
                P.last_name AS patient_last_name
            FROM Appointment A
            JOIN Patient P ON A.P_ID = P.patient_id
            WHERE A.D_ID = ?;
        `;
        const [appointments] = await db.query(query, [doctorId]);
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get detailed information for a specific doctor
router.get('/:id', async (req, res) => {
    const doctorId = req.params.id;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required.' });
    }

    try {
        const query = `
            SELECT 
                D.employee_ssn, 
                D.username,
                D.Admin_ssn,
                D.first_name, 
                D.last_name, 
                D.hire_date, 
                D.salary, 
                D.office_id, 
                D.specialty, 
                D.specialist, 
                D.cost
            FROM Doctor D
            WHERE D.employee_ssn = ?;
        `;
        const [doctor] = await db.query(query, [doctorId]);

        if (doctor.length > 0) {
            res.json(doctor[0]);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        console.error("Error fetching doctor details:", error.stack);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get doctor-patient history
router.get('/doctor_patient_history', async (req, res) => {
    const doctorId = req.query.doctorId;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required.' });
    }

    try {
        const query = `
            SELECT 
                P.patient_id, 
                P.first_name AS patient_first_name, 
                P.last_name AS patient_last_name,
                A.app_date, 
                A.reason_for_visit,
                D.first_name AS doctor_first_name,
                D.last_name AS doctor_last_name
            FROM Appointment A
            JOIN Patient P ON A.P_ID = P.patient_id
            JOIN Doctor D ON A.D_ID = D.employee_ssn
            WHERE D.employee_ssn = ?;
        `;
        const [history] = await db.query(query, [doctorId]);
        res.json({ success: true, data: history });
    } catch (error) {
        console.error("Error fetching doctor-patient history:", error.stack);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor-patient history',
        });
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
                D.first_name AS doctor_name, 
                D.last_name AS doctor_last_name,
                COUNT(R.referral_id) AS referral_count
            FROM Referral R
            JOIN Doctor D ON R.specialist = D.employee_ssn
            WHERE R.ref_date BETWEEN ? AND ?
            GROUP BY D.employee_ssn
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
// Route to create a referral
router.post('/referrals', async (req, res) => {
    const { specialist, patientId, referralReason } = req.body;

    if (!specialist || !patientId || !referralReason) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const query = `
            INSERT INTO Referral (specialist, P_ID, reason_for_referral, ref_date)
            VALUES (?, ?, ?, NOW());
        `;
        await db.query(query, [specialist, patientId, referralReason]);

        res.status(201).json({ message: 'Referral created successfully!' });
    } catch (error) {
        console.error('Error creating referral:', error.stack);
        res.status(500).json({ message: 'Server error. Unable to create referral.' });
    }
});


module.exports = router;
