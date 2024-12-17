const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "karthik",
    database: "EmployeeManagement"
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to MySQL Database');
    }
});

module.exports = db;