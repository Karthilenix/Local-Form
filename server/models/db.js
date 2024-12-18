const mysql = require('mysql2');
require('dotenv').config();

// Determine which environment we're in
const isProduction = process.env.NODE_ENV === 'production';

// Select the appropriate database configuration
const dbConfig = {
    host: isProduction ? process.env.RAILWAY_DB_HOST : process.env.LOCAL_DB_HOST,
    user: isProduction ? process.env.RAILWAY_DB_USER : process.env.LOCAL_DB_USER,
    password: isProduction ? process.env.RAILWAY_DB_PASSWORD : process.env.LOCAL_DB_PASSWORD,
    database: isProduction ? process.env.RAILWAY_DB_NAME : process.env.LOCAL_DB_NAME,
    port: isProduction ? process.env.RAILWAY_DB_PORT : process.env.LOCAL_DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create the connection pool
const pool = mysql.createPool(dbConfig).promise();

// Test the connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully to:', dbConfig.host);
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

// Initial connection test
testConnection().catch(console.error);

module.exports = pool;