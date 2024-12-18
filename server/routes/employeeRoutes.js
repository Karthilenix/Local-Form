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
        const checkResult = await db.query(
            'SELECT employeeid FROM employees WHERE employeeid = $1',
            [employeeId]
        );

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: 'Employee ID already exists' });
        }

        // If employee ID doesn't exist, proceed with insertion
        const result = await db.query(
            `INSERT INTO employees (firstname, lastname, employeeid, email, phone, department, dateofjoining, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [firstName, lastName, employeeId, email, phone, department, dateOfJoining, role]
        );

        res.status(201).json({
            message: 'Employee added successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Database error', 
            error: error.message 
        });
    }
});

// Route to get all employees
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM employees ORDER BY employeeid');
        res.status(200).json({ employees: result.rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Database error', 
            error: error.message 
        });
    }
});

// Route to get an employee by employeeId
router.get('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    try {
        const result = await db.query('SELECT * FROM employees WHERE employeeid = $1', [employeeId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ employee: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Database error', 
            error: error.message 
        });
    }
});

module.exports = router;
