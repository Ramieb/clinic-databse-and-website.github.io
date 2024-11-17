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

// Serve the main index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html')); // Adjust path if needed
});

// Serve static files
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// Import and use backend routes
const loginRoute = require('./backend/routerFiles/loginRoute');
app.use('/login', loginRoute);

const registerRoute = require('./backend/routerFiles/registerRoute');
app.use('/register', registerRoute);

const patientRoute = require('./backend/routerFiles/patientRoute');
app.use('/api', patientRoute);

const doctorRoute = require('./backend/routerFiles/doctorRoute');
app.use('/api/doctor', doctorRoute);

// Serve other static assets from the root directory if needed
app.use(express.static(path.join(__dirname)));

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Set the port for Azure or default to 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
