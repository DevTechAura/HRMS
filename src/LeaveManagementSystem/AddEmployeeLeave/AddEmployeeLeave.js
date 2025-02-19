import React, { useState } from 'react';
import axios from 'axios';

const LeaveBalanceForm = () => {
    const [formData, setFormData] = useState({
        EmpID: '',
        name: '',
        email: '',
        Leavetype: '',
        AssignedLeave: '',
        AvailedLeave: '',
        CarryforwardBalance: '',
        PendingLeave: '',
        assignrole: ''
    });

    // Handle input changes for all fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.EmpID || !formData.name || !formData.email || !formData.Leavetype || !formData.assignrole) {
            alert('Please fill out all required fields.');
            return;
        }

        // Log the form data for debugging
        console.log('Form Data before sending:', formData);

        // Set default values for optional fields if empty
        const dataToSend = {
            EmpID: formData.EmpID,
            name: formData.name || null,
            email: formData.email || null,
            Leavetype: formData.Leavetype || null,
            AssignedLeave: formData.AssignedLeave || 0,
            AvailedLeave: formData.AvailedLeave || 0,
            CarryforwardBalance: formData.CarryforwardBalance || 0,
            PendingLeave: formData.PendingLeave || 0,
            assignrole: formData.assignrole || null
        };

        try {
            // Send POST request to backend API
            const response = await axios.post('http://localhost:3002/api/leave_balance', dataToSend);

            if (response.status === 200) {
                alert('Leave balance added successfully!');
                setFormData({
                    EmpID: '',
                    name: '',
                    email: '',
                    Leavetype: '',
                    AssignedLeave: '',
                    AvailedLeave: '',
                    CarryforwardBalance: '',
                    PendingLeave: '',
                    assignrole: ''
                });
            }
        } catch (error) {
            console.error('Error adding leave balance:', error);
            alert('Failed to add leave balance.');
        }
    };

    return (
        <div>
            <h2>Add Leave Balance</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>EmpID</label>
                    <input
                        type="text"
                        name="EmpID"
                        value={formData.EmpID}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Leave Type</label>
                    <input
                        type="text"
                        name="Leavetype"
                        value={formData.Leavetype}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Assigned Leave</label>
                    <input
                        type="number"
                        name="AssignedLeave"
                        value={formData.AssignedLeave}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Availed Leave</label>
                    <input
                        type="number"
                        name="AvailedLeave"
                        value={formData.AvailedLeave}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Carryforward Balance</label>
                    <input
                        type="number"
                        name="CarryforwardBalance"
                        value={formData.CarryforwardBalance}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Pending Leave</label>
                    <input
                        type="number"
                        name="PendingLeave"
                        value={formData.PendingLeave}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Assign Role</label>
                    <input
                        type="text"
                        name="assignrole"
                        value={formData.assignrole}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit">Save Leave Balance</button>
            </form>
        </div>
    );
};

export default LeaveBalanceForm;
