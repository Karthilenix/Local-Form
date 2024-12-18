const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes'); 
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config(); 

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
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
app.get('/api/debug/db', (req, res) => {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
    };
    
    res.json({
        message: 'Database configuration (without password)',
        config: dbConfig,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Your employee-related route
app.use('/api/employees', employeeRoutes);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test database connection
db.connect(err => {
    if (err) {
        console.error("Database Connection Error:", err);
        console.error("Database Config:", {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME
        });
        return;
    }
    console.log("Connected to the MySQL database.");
});

// Start the server
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Database Host:', process.env.DB_HOST);
});
