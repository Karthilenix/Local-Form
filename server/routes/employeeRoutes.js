const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Route to add a new employee
router.post('/', async (req, res) => {
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

    try {
        // First check if employee ID exists
        const checkSql = 'SELECT employeeId FROM employees WHERE employeeId = ?';
        db.query(checkSql, [employeeId], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Database check error:', checkErr);
                return res.status(500).json({ message: 'Database error', error: checkErr.message });
            }

            if (checkResult && checkResult.length > 0) {
                return res.status(400).json({ message: 'Employee ID already exists' });
            }

            // If employee ID doesn't exist, proceed with insertion
            const insertSql = `INSERT INTO employees (firstName, lastName, employeeId, email, phone, department, dateOfJoining, role)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.query(insertSql, [firstName, lastName, employeeId, email, phone, department, dateOfJoining, role], (insertErr, result) => {
                if (insertErr) {
                    console.error('Database insert error:', insertErr);
                    if (insertErr.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: 'Email address already exists' });
                    }
                    return res.status(500).json({ message: 'Database error', error: insertErr.message });
                }

                res.status(201).json({ 
                    message: 'Employee added successfully', 
                    data: { 
                        id: result.insertId,
                        employeeId,
                        firstName,
                        lastName
                    } 
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to get all employees
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM employees';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
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
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ employee: result[0] });
    });
});

module.exports = router;
