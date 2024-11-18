// registerRoute.js

const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { username, password } = req.body; // Removed 'role' from the request body
    
    // Log the incoming registration attempt
    console.log("Registration attempt:", req.body);

    try {
        // Check if the username already exists
        console.log("Checking if username already exists:", username);
        const [existingUser] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            console.log("Username already taken:", username);
            return res.status(409).json({ message: 'Username already taken' });
        }

        // Insert new user into Users table with role set to 'patient'
        const role = 'patient'; // Default role
        await db.query('INSERT INTO Users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
        console.log("Registration successful for:", username);
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;