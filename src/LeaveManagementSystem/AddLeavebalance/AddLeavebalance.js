import React, { useState } from "react";
import axios from "axios";

const AddLeaveBalance = () => {
    const [formData, setFormData] = useState({
        EmpID: "",
        name: "",
        email: "",
        Leavetype: "",
        AssignedLeave: "",
        AvailedLeave: "",
        CarryforwardBalance: "",
        pendingLeave: "",
        assignrole: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculatePendingLeave = (assigned, availed) => assigned - availed;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            pendingLeave: calculatePendingLeave(
                formData.AssignedLeave,
                formData.AvailedLeave
            ),
        };
        try {
            const response = await fetch("http://localhost:3002/api/leave_balance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFormData),
            });
            if (response.ok) {
                alert("Record added successfully!");
            } else {
                alert("Error adding record.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ margin: "20px" }}>
            <h2>Add Leave Balance Record</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: "Employee ID", name: "EmpID", type: "text" },
                    { label: "Name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Leave Type", name: "Leavetype", type: "text" },
                    { label: "Assigned Leave", name: "AssignedLeave", type: "number" },
                    { label: "Availed Leave", name: "AvailedLeave", type: "number" },
                    { label: "Carry Forward Balance", name: "CarryforwardBalance", type: "number" },
                    { label: "Pending Leave", name: "pendingLeave", type: "number" },
                    { label: "Role", name: "assignrole", type: "text" },
                ].map((field) => (
                    <div key={field.name} style={{ marginBottom: "10px" }}>
                        <label>{field.label}:</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            style={{ marginLeft: "10px", width: "250px", padding: "5px" }}
                            required
                        />
                    </div>
                ))}
                <button type="submit" style={{ padding: "10px 20px" }}>
                    Add Record
                </button>
            </form>
        </div>
    );
};

export default AddLeaveBalance;
