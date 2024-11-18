const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const app = express();

// Load environment variables
require('dotenv').config();

// Apply security headers
app.use(helmet());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Define CORS options
const corsOptions = {
    origin: [
        'http://127.0.0.1:5501', // Local testing
        'https://clinic-website.azurewebsites.net' // Azure frontend
    ],
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
    res.sendFile(path.join(__dirname, 'index.html')); // Ensure index.html is in the root directory
});

// Serve static files
app.use('/html', express.static(path.join(__dirname, 'html'))); // Serve additional HTML files
app.use('/frontend', express.static(path.join(__dirname, 'frontend'))); // Serve frontend assets
app.use(express.static(path.join(__dirname))); // Serve static files from the root directory

// Import and use backend routes
const loginRoute = require('./backend/routerFiles/loginRoute');
app.use('/login', loginRoute);

const registerRoute = require('./backend/routerFiles/registerRoute');
app.use('/register', registerRoute);

const patientRoute = require('./backend/routerFiles/patientRoute');
app.use('/api', patientRoute);

const doctorRoute = require('./backend/routerFiles/doctorRoute');
app.use('/api/doctor', doctorRoute);

const reportRoute = require('./backend/rputerFiles/reportRoute');  // Import your reportRoute file
app.use(reportRoute); 

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// POST route to add doctor
app.post('/api/doctor/add', (req, res) => {
    const { first_name, last_name, employee_ssn, specialty, salary, office_id } = req.body;
  
    const query = `
      INSERT INTO doctors (first_name, last_name, employee_ssn, specialty, salary, office_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [first_name, last_name, employee_ssn, specialty, salary, office_id], (err, result) => {
      if (err) {
        console.error('Error adding doctor:', err);
        return res.status(500).json({ message: 'Failed to add doctor' });
      }
      res.status(200).json({ message: 'Doctor added successfully', doctorId: result.insertId });
    });
  });

// Set the port for Azure or default to 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
