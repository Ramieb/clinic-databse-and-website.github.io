// Server.js

const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(helmet()); // Adds security headers
app.use(bodyParser.json());

// Define CORS options
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Allows your local frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Apply CORS options to all requests
app.use(cors(corsOptions));

// Handle preflight requests for all routes with OPTIONS method
app.options('*', cors(corsOptions));

// Serve the main index.html file from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files from the 'html' folder (for any additional HTML files)
app.use('/html', express.static(path.join(__dirname, 'html')));

// Serve static files from the 'frontend' folder (for client-side JavaScript, CSS, etc.)
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// Import and use backend routes from the 'routerFiles' folder
const loginRoute = require('./backend/routerFiles/loginRoute');
app.use('/api/login', loginRoute);
//app.use('/login', loginRoute);

const registerRoute = require('./backend/routerFiles/registerRoute');
app.use('/api/register', registerRoute);
//app.use('/register', registerRoute);

// Import and use the patientRoute
const patientRoute = require('./backend/routerFiles/patientRoute');
app.use('/api', patientRoute); // Prefix routes with /api
//app.use('/api/patient', patientRoute);

// Explicitly add the doctor route
const doctorRoute = require('./backend/routerFiles/doctorRoute');
app.use('/api/doctor', doctorRoute); // Prefix doctor routes with /api/doctor

// Serve other static assets from root if needed (like root-level CSS or JS)
app.use(express.static(path.join(__dirname)));

// Set the port for Azure or default to 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Jared's code
// Endpoint to get the list of doctors for the dropdown in the doctors page.
app.get('/getDoctors', (req, res) => {
    const sql = `
        SELECT D.employee_ssn, D.first_name, D.last_name, D.specialty, D.specialist, D.cost, O.location
        FROM Doctor D
        LEFT JOIN Office O ON D.office_id = O.office_id;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving doctors');
        } else {
            res.json(results);
        }
    });
});
// Endpoint to get appointments for a specific doctor and date
app.get('/getAppointments', (req, res) => {
    const patientId = req.query.patientId;
    const sql = `
        SELECT A.app_date, A.app_start_time, A.app_end_time, D.first_name AS doctor_first, D.last_name AS doctor_last, A.reason_for_visit
        FROM Appointment A
        JOIN Doctor D ON A.D_ID = D.employee_ssn
        WHERE A.P_ID = ?;
    `;
    db.query(sql, [patientId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving appointments');
        } else {
            res.json(results);
        }
    });
});
// Fetch Employees Endpoint
app.get('/api/employees', (req, res) => {
    const query = 'SELECT id, firstName, lastName, position, hireDate FROM employees';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            res.status(500).send('Error fetching employees');
            return;
        }
        // Send the employee data as JSON response
        res.json(results);
    });
});
// Endpoint to fetch referral count by doctor for a given time range
app.get('/referral-report-by-doctor', (req, res) => {
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
app.get('/salary-vs-billing-report', (req, res) => {
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