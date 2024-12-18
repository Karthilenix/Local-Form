const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes'); 
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config(); 

const app = express();

// Determine which environment we're in
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
    origin: isProduction 
        ? ['https://local-form.onrender.com']
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(bodyParser.json());

// Add a simple route to confirm server is running
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Debug route to check database connection
app.get('/api/debug/db', async (req, res) => {
    const dbConfig = {
        host: isProduction ? process.env.RAILWAY_DB_HOST : process.env.LOCAL_DB_HOST,
        user: isProduction ? process.env.RAILWAY_DB_USER : process.env.LOCAL_DB_USER,
        password: isProduction ? process.env.RAILWAY_DB_PASSWORD : process.env.LOCAL_DB_PASSWORD,
        database: isProduction ? process.env.RAILWAY_DB_NAME : process.env.LOCAL_DB_NAME,
        port: isProduction ? process.env.RAILWAY_DB_PORT : process.env.LOCAL_DB_PORT
    };
    
    try {
        const connection = await mysql.createConnection(dbConfig).promise();
        await connection.query('SELECT 1');
        await connection.end();
        res.json({ 
            status: 'success',
            message: 'Database connection successful',
            config: {
                host: dbConfig.host,
                user: dbConfig.user,
                database: dbConfig.database,
                port: dbConfig.port
            }
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Your employee-related route
app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', isProduction ? 'Production' : 'Development');
    console.log('Database Host:', isProduction ? process.env.RAILWAY_DB_HOST : process.env.LOCAL_DB_HOST);
});
