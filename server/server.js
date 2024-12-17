const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes'); // Assuming you have employeeRoutes.js file
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({
    origin: 'https://local-form.onrender.com', // Your frontend's URL on Render
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the necessary HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow appropriate headers
}));
app.use(bodyParser.json());

// Add a simple route to confirm server is running
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Your employee-related route
app.use('/api/employees', employeeRoutes);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database.");
});


// Start the server
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
