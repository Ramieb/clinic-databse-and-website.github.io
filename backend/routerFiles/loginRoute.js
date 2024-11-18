// loginRoute.js

const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", req.body);

    try {
        // Check for user in Users table
        const [userRows] = await db.query(
            'SELECT * FROM Users WHERE username = ? AND password = ?',
            [username, password]
        );
        
        if (userRows.length > 0) {
            const user = userRows[0];
            let redirectPath = '';
            switch (user.role) {
                case 'doctor':
                    redirectPath = '/html/doctor.html';
                    break;
                case 'nurse':
                    redirectPath = '/html/nurse.html';
                    break;
                case 'receptionist':
                    redirectPath = '/html/receptionist.html';
                    break;
                case 'admin':
                    redirectPath = '/html/admin.html';
                    break;
                case 'patient':
                    redirectPath = `/html/patient.html?username=${user.username}`;
                    break;
                default:
                    return res.status(401).json({ message: 'Role not recognized' });
            }
            return res.json({ redirect: redirectPath });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Error during login attempt:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;