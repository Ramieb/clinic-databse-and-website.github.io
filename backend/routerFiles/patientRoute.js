const express = require('express');
const router = express.Router();
const db = require('../db');

// Database Retrieval Functions

// Function to get payment data
function getPaymentData(username) {
    console.log('start of getPaymentData');
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Payment WHERE username = ?`;
        console.log('selected data from Payment table');
        db.query(query, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
            console.log('results gotten');
        });
    });
}

// Function to get referral data
function getReferralData(username) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Referral WHERE username = ?`;
        db.query(query, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

// Function to get medication data
function getMedicationData(username) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Medication WHERE username = ?`;
        db.query(query, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

// Function to get allergy data
function getAllergyData(username) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Allergies WHERE username = ?`;
        db.query(query, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

// Function to get illness data
function getIllnessData(username) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Illness WHERE username = ?`;
        db.query(query, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

// Function to get surgery data
function getSurgeryData(username) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Surgery WHERE username = ?`;
        db.query(query, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

// Function to get immunization data
function getImmunizationData(username) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Immunization WHERE username = ?`;
        db.query(query, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

// Function to get medical history data
function getMedHistoryData(username) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Med_History WHERE username = ?`;
        db.query(query, [username], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

// Routes for each section
router.get('/appointments/:username', (req, res) => { /* Existing route */ });
router.get('/prescriptions/:username', (req, res) => { /* Existing route */ });
router.get('/billing/:username', (req, res) => { /* Existing route */ });

// New routes for additional sections

router.get('/payment/:username', async (req, res) => {
    try {
        const data = await getPaymentData(req.params.username);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving payment data' });
    }
});

router.get('/referrals/:username', async (req, res) => {
    try {
        const data = await getReferralData(req.params.username);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving referral data' });
    }
});

router.get('/medications/:username', async (req, res) => {
    try {
        const data = await getMedicationData(req.params.username);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving medication data' });
    }
});

router.get('/allergies/:username', async (req, res) => {
    try {
        const data = await getAllergyData(req.params.username);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving allergy data' });
    }
});

router.get('/illnesses/:username', async (req, res) => {
    try {
        const data = await getIllnessData(req.params.username);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving illness data' });
    }
});

router.get('/surgeries/:username', async (req, res) => {
    try {
        const data = await getSurgeryData(req.params.username);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving surgery data' });
    }
});

router.get('/immunizations/:username', async (req, res) => {
    try {
        const data = await getImmunizationData(req.params.username);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving immunization data' });
    }
});

router.get('/med-history/:username', async (req, res) => {
    try {
        const data = await getMedHistoryData(req.params.username);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving medical history data' });
    }
});

module.exports = router;
