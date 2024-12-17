const express = require('express');
const router = express.Router();  // Router instance to define API routes
const db = require('../models/db');  // Import the database connection

// Route to add a new employee
router.post('/', (req, res) => {
    const {
        firstName,
        lastName,
        employeeId,
        email,
        phone,
        department,
        dateOfJoining,
        role
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !employeeId || !email || !phone || !department || !dateOfJoining || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert the employee into the database
    const sql = `INSERT INTO employees (firstName, lastName, employeeId, email, phone, department, dateOfJoining, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [firstName, lastName, employeeId, email, phone, department, dateOfJoining, role], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Employee ID or Email already exists' });
            }
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        res.status(201).json({ message: 'Employee added successfully', data: result });
    });
});

// Route to get all employees
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM employees';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        res.status(200).json({ employees: results });
    });
});

// Route to get an employee by employeeId
router.get('/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    const sql = 'SELECT * FROM employees WHERE employeeId = ?';

    db.query(sql, [employeeId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ employee: result[0] });
    });
});

module.exports = router;
