// Endpoint to fetch referral count by doctor for a given time range
const express = require('express');
const db = require('../db'); // Import your database connection
const router = express.Router();

router.get('/referral-report-by-doctor', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
        return res.status(400).json({ error: 'Valid start and end dates are required.' });
    }

    try {
        const query = `
            SELECT 
                d.employee_ssn, 
                CONCAT(d.first_name, ' ', d.last_name) AS doctor_name, 
                COUNT(r.primary_doc) AS referral_count
            FROM 
                Referral r
            JOIN 
                Doctor d ON r.primary_doc = d.employee_ssn
            GROUP BY 
                d.employee_ssn;
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