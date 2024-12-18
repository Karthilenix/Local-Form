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
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const departments = ['HR', 'Manager', 'Developer', 'Finance', 'Operations'];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear message when user starts typing
        if (message) {
            setMessage('');
            setMessageType('');
        }
    };

    const validate = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const joinDate = new Date(formData.dateOfJoining);
        joinDate.setHours(0, 0, 0, 0);

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
        
        if (!formData.employeeId) {
            newErrors.employeeId = "Please enter the Employee ID.";
        } else if (!/^[a-zA-Z0-9]{1,10}$/.test(formData.employeeId)) {
            newErrors.employeeId = "Employee ID must be alphanumeric and max 10 characters.";
        }
        
        if (!formData.email) {
            newErrors.email = "Please enter the Email.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = "Invalid email address.";
        }
        
        if (!formData.phone) {
            newErrors.phone = "Please enter the Phone number.";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        }
        
        if (!formData.department) newErrors.department = "Please enter the Department.";
        
        if (!formData.dateOfJoining) {
            newErrors.dateOfJoining = "Please enter the Date of joining.";
        } else if (joinDate.getTime() === today.getTime()) {
            newErrors.dateOfJoining = "Date of joining cannot be current date.";
        } else if (joinDate > today) {
            newErrors.dateOfJoining = "Date of joining cannot be a future date.";
        }
        
        if (!formData.role.trim()) newErrors.role = "Please enter the Role.";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        const formDataToSend = {
            ...formData,
            email: formData.email.toLowerCase(),
            dateOfJoining: formData.dateOfJoining
        };

        try {
            const response = await fetch("http://localhost:6001/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formDataToSend)
            });

            const data = await response.json();

            if (!response.ok) {
                // Server returned an error
                setMessage(data.message || "An error occurred");
                setMessageType('error');
                console.error("Server Error:", data);
                return;
            }

            // Success case
            setMessage("Employee added successfully!");
            setMessageType('success');
            console.log('Success:', data);
            
            // Clear form only on success
            setFormData({
                firstName: '',
                lastName: '',
                employeeId: '',
                email: '',
                phone: '',
                department: '',
                dateOfJoining: '',
                role: '',
            });
        } catch (error) {
            setMessage("Network error. Please try again.");
            setMessageType('error');
            console.error("Network Error:", error);
        }
    };

    return (
        <form className="employee-form" onSubmit={handleSubmit}>
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}
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
                <input type="email" placeholder='Enter the Email' name="email" value={formData.email} onChange={handleInputChange} />
                {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                <label>Phone:</label>
                <input type="tel" placeholder='Enter the Phone number' name="phone" value={formData.phone} onChange={handleInputChange} />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className={`form-group ${errors.department ? 'has-error' : ''}`}>
                <label>Department:</label>
                <select name="department" value={formData.department} onChange={handleInputChange}>
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
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
                <input type="text" placeholder='Enter the Role' name="role" value={formData.role} onChange={handleInputChange} />
                {errors.role && <span className="error-message">{errors.role}</span>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default EmployeeForm;
