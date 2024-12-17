import React from 'react';
import EmployeeForm from './components/EmployeeForm';
import './App.css';
function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Employee Details Form</h1>
                <p>Add Employee Details</p>
            </header>
            <main className="app-main">
                <EmployeeForm />
            </main>
        </div>
    );
}

export default App;