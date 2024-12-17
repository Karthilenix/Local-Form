import React, { useState } from 'react';
import './EmployeeForm.css';

function EmployeeForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        employeeId: '',
        email: '',
        phone: '',
        department: '',
        dateOfJoining: '',
        role: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(''); // State to handle the thank you message


    const departments = ['HR', 'Manager', 'Developer', 'Finance', 'Operations'];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const joinDate = new Date(formData.dateOfJoining);
        joinDate.setHours(0, 0, 0, 0);

        // Name validation
        if (!formData.firstName.trim()){
            newErrors.firstName = "Please enter the First name.";
        }else if(!/^[A-Z][a-z]*$/.test(formData.firstName)) {
            newErrors.firstName = "Only First letter must be Capital.";
        }
        if (!formData.lastName.trim()){
            newErrors.lastName = "Please enter the Last name.";
        }else if(!/^[A-Z][a-z]*$/.test(formData.lastName)) {
            newErrors.lastName = "Only First letter must be Capital.";
        }
        
        // Employee ID validation (alphanumeric, max 10 characters)
        if (!formData.employeeId) {
            newErrors.employeeId = "Please enter the Employee ID.";
        } else if (!/^[a-zA-Z0-9]{1,10}$/.test(formData.employeeId)) {
            newErrors.employeeId = "Employee ID must be alphanumeric and max 10 characters.";
        }
        
        // Email validation
        if (!formData.email) {
            newErrors.email = "Please enter the Email.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = "Invalid email address.";
        }
        
        // Phone validation (10 digits, no special characters)
        if (!formData.phone) {
            newErrors.phone = "Please enter the Phone number.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        }
        
        // Department validation
        if (!formData.department) newErrors.department = "Please enter the Department.";
        
        // Date validation
        if (!formData.dateOfJoining) {
            newErrors.dateOfJoining = "Please enter the Date of joining.";
        } else if (joinDate.getTime() === today.getTime()) {
            newErrors.dateOfJoining = "Date of joining cannot be current date.";
        } else if (joinDate > today) {
            newErrors.dateOfJoining = "Date of joining cannot be a future date.";
        }
        
        // Role validation
        if (!formData.role.trim()) newErrors.role = "Please enter the Role.";

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            // Convert email to lowercase before sending
            const formDataToSend = {
                ...formData,
                email: formData.email.toLowerCase(),
                dateOfJoining: formData.dateOfJoining // Send dateOfJoining as is, as Date Object
            };
            // Send formData to backend
            fetch("http://localhost:6001/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formDataToSend)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`); // Handle non-2xx responses
                }
                return response.json(); // Parse JSON response
            })
            .then(data => {
                setMessage(data.message); // Assuming backend sends a message
                console.log('Success:', data); // Check the response data in the console
                setFormData({ //Clear the form after successfull submission
                    firstName: '',
                    lastName: '',
                    employeeId: '',
                    email: '',
                    phone: '',
                    department: '',
                    dateOfJoining: '',
                    role: '',
                })
            })
            .catch(error => {
                setMessage("Employee ID already exist. Please try again."); // Display error message
                console.error("Error:", error);
            });
        }
    };

    return (
        <form className="employee-form" onSubmit={handleSubmit}>
            <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
                <label>First Name:</label>
                <input type="text" placeholder='Enter the First name' name="firstName" value={formData.firstName} onChange={handleInputChange} />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
                <label>Last Name:</label>
                <input type="text" placeholder='Enter the Last name' name="lastName" value={formData.lastName} onChange={handleInputChange} />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
            <div className={`form-group ${errors.employeeId ? 'has-error' : ''}`}>
                <label>Employee ID:</label>
                <input type="text" placeholder='Eg:22IT046' name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
                {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
            </div>
            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label>Email:</label>
                <input type="email" placeholder='Eg:xyz@gmail.com' name="email" value={formData.email} onChange={handleInputChange} />
                {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                <label>Phone:</label>
                <input type="text" placeholder='Do not mention +91' name="phone" value={formData.phone} onChange={handleInputChange} />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className={`form-group ${errors.department ? 'has-error' : ''}`}>
                <label>Department:</label>
                <select name="department" value={formData.department} onChange={handleInputChange}>
                    <option value="">Your department</option>
                    {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                </select>
                {errors.department && <span className="error-message">{errors.department}</span>}
            </div>
            <div className={`form-group ${errors.dateOfJoining ? 'has-error' : ''}`}>
                <label>Date of Joining:</label>
                <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} />
                {errors.dateOfJoining && <span className="error-message">{errors.dateOfJoining}</span>}
            </div>
            <div className={`form-group ${errors.role ? 'has-error' : ''}`}>
                <label>Role:</label>
                <input type="text" placeholder='Eg:Developer'npm install mysql2 name="role" value={formData.role} onChange={handleInputChange} />
                {errors.role && <span className="error-message">{errors.role}</span>}
            </div>
            <div className="button-group">
                <button type="submit">Submit</button>
            </div>
            {message && <p className="thank-you-message">{message}</p>} {/* Display thank you message */}
        </form>
    );
}

export default EmployeeForm;
