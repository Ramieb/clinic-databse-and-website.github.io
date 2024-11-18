const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection file

// Route to get all doctors for dropdowns or general listing
router.get('/getDoctors', async (req, res) => {
    try {
        const query = `
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
        `;
        const [doctors] = await db.query(query);
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get appointments for a specific patient
router.get('/getAppointments', async (req, res) => {
    const patientId = req.query.patientId;

    try {
        const query = `
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
        `;
        const [appointments] = await db.query(query, [patientId]);
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
        const query = `
            SELECT * 
            FROM Doctor 
            WHERE employee_ssn = ?;
        `;
        const [doctorRows] = await db.query(query, [doctorId]);

        if (doctorRows.length > 0) {
            res.json(doctorRows[0]);
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
        const query = `
            SELECT * 
            FROM Appointment 
            WHERE D_ID = ?;
        `;
        const [appointments] = await db.query(query, [doctorId]);
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get doctor-patient history
router.get('/doctor_patient_history', async (req, res) => {
    try {
        const query = `
            SELECT 
                P.patient_id, P.first_name, P.last_name,
                H.height, H.weight, H.blood_pressure,
                MED.medicine, MED.start_date, MED.end_date, MED.dosage,
                A.allergy, A.start_date, A.end_date, A.seasonal,
                S.procedure_done, S.body_part, S.surgery_date,
                IMM.vaccine, IMM.vax_date,
                ILL.ailment, ILL.start_date, ILL.end_date
            FROM Patient AS P
            LEFT JOIN Med_history AS H ON P.patient_id = H.P_ID
            LEFT JOIN Medication AS MED ON P.patient_id = MED.P_ID
            LEFT JOIN Allergies AS A ON P.patient_id = A.P_ID
            LEFT JOIN Surgery AS S ON P.patient_id = S.P_ID
            LEFT JOIN Immunization AS IMM ON P.patient_id = IMM.P_ID
            LEFT JOIN Illness AS ILL ON P.patient_id = ILL.P_ID;
        `;
        const [rows] = await db.query(query);
        res.json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching doctor-patient history:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching doctor-patient history",
        });
    }
});

// Endpoint to fetch referral count by doctor for a given time range
router.get('/referral-report-by-doctor', async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start and end date are required.' });
    }

    try {
        const query = `
            SELECT 
                D.first_name AS doctorName, 
                COUNT(R.referral_id) AS referralCount
            FROM Referral R
            JOIN Doctor D ON R.specialist = D.employee_ssn
            WHERE R.ref_date BETWEEN ? AND ?
            GROUP BY D.employee_ssn
            ORDER BY referralCount DESC;
        `;
        const [results] = await db.query(query, [startDate, endDate]);
        res.json(results);
    } catch (error) {
        console.error("Error fetching referral report:", error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to fetch salary vs billing for doctors within a time range
router.get('/salary-vs-billing-report', async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start and end date are required.' });
    }

    try {
        const query = `
            SELECT 
                D.first_name AS doctorName, 
                D.salary AS salary,
                SUM(B.total_charge) AS billingAmount
            FROM Doctor D
            JOIN Billing B ON D.employee_ssn = B.D_ID
            WHERE B.charge_date BETWEEN ? AND ?
            GROUP BY D.employee_ssn
            ORDER BY billingAmount DESC;
        `;
        const [results] = await db.query(query, [startDate, endDate]);
        res.json(results);
    } catch (error) {
        console.error("Error fetching salary vs billing report:", error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
