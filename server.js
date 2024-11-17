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
    origin: 'http://127.0.0.1:5501', // Allows your local frontend
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
app.use('/login', loginRoute);

const registerRoute = require('./backend/routerFiles/registerRoute');
app.use('/register', registerRoute);

// Import and use the patientRoute
const patientRoute = require('./backend/routerFiles/patientRoute');
app.use('/api', patientRoute); // Prefix routes with /api

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


