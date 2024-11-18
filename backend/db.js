/* db.js - Database Connection: db.js handles the connection to the MySQL database, 
where the new user’s information is stored in the Users table. */

require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Default to 3306 if DB_PORT not specified
    ssl: {
        rejectUnauthorized: true // Adjust based on your SSL requirements
    }
});

// Test the database connection
db.getConnection()
    .then(async (connection) => {
        console.log("Database connected successfully to", process.env.DB_NAME);

        // Test if the Users table exists and is accessible
        try {
            const [rows] = await connection.query('SHOW TABLES LIKE "Users";');
            if (rows.length > 0) {
                console.log("Users table exists and is accessible.");
            } else {
                console.log("Users table does not exist. Please ensure the table is created.");
            }
        } catch (error) {
            console.error("Error checking Users table existence:", error.message);
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    })
    .catch(error => {
        console.error("Database connection error:", error.message);
    });

module.exports = db;