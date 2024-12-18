const mysql = require('mysql2');
require('dotenv').config();

// Create the connection pool to handle multiple connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // Use promise wrapper for async/await support

// Test the connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

// Initial connection test
testConnection().catch(console.error);

module.exports = pool;