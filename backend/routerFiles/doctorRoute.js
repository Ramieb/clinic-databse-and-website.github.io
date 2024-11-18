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
    const doctorId = req.query.employee_ssn;

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
    const doctorId = req.params.employee_ssn;

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
    const doctorId = req.query.employee_ssn;

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

// Route to update referral status
router.put('/updateReferralStatus', async (req, res) => {
    const { referralId, status } = req.body;

    if (!referralId || !status) {
        return res.status(400).json({ message: 'Referral ID and status are required.' });
    }

    try {
        const query = `
            UPDATE Referral
            SET status = ?, response_date = NOW()
            WHERE referral_id = ?;
        `;
        await db.query(query, [status, referralId]);

        res.status(200).json({ message: `Referral ${status} successfully!` });
    } catch (error) {
        console.error('Error updating referral status:', error.stack);
        res.status(500).json({ message: 'Server error. Unable to update referral status.' });
    }
});

module.exports = router;
