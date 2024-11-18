// Other required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(bodyParser.json());

// Define CORS options
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Adjust based on your frontend location
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

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

const receptioninstRoute = require('./backend/routerFiles/receptioninstRoute');
app.use('/api', receptioninstRoute);

// Explicitly add the doctor route
const doctorRoute = require('./backend/routerFiles/doctorRoute');
app.use('/api/doctor', doctorRoute); // Prefix doctor routes with /api/doctor

// Set the port for Azure or default to 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
