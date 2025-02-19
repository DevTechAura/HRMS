import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import { useAuth } from '../../EmployeeRecords/AuthContext/AuthContext';
import axios from 'axios';
import './ApplyLeave.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ApplyLeave = () => {
    const navigate = useNavigate();
    const { EmpID } = useAuth();
    const [leaveData, setLeaveData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [availedLeave, setAvailedLeave] = useState(0);
    const [pendingLeave, setPendingLeave] = useState(0);
    const [reason, setReason] = useState('');
    const [totalnoofdays, settotalnoofdays] = useState('');

    useEffect(() => {
        fetchLeaveData();
        fetchEmployeeId();
    }, []);

    const fetchLeaveData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3002/api/leave_balance?EmpID=${EmpID}`);

            // Filter the leave data to get only the logged-in employee's data
            const filteredData = response.data.filter(item => item.EmpID === EmpID); // Ensure you get only Gangothri's data
            const sanitizedData = filteredData.map(item => ({
                ...item,
                pendingLeave: item.pendingLeave === null ? 0 : item.pendingLeave
            }));

            setLeaveData(sanitizedData);
        } catch (error) {
            setMessage('Error fetching leave data: ' + error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const fetchEmployeeId = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/api/employeerecord?EmpID=${EmpID}`);
            console.log("Employee Data Response:", response.data); // Log to check the response

            // Check if the employee data is in a valid format and contains EmpID
            const employeeDataResponse = response.data;
            if (employeeDataResponse && Array.isArray(employeeDataResponse) && employeeDataResponse.length > 0) {
                const EmpId = employeeDataResponse[0].EmpID;
                console.log('EmpId:', EmpId);
                
            } else {
                setMessage('Error: Employee data not available or invalid format');
                console.error('Error: Employee data not available or invalid format');
            }
        } catch (error) {
            console.error('Error fetching employee ID:', error);
            setMessage('Error fetching employee data.');
        }
    };

    const getAssignedLeaveByType = (type) => {
        const leave = leaveData.find((item) => item.Leavetype === type);
        return leave ? leave.AssignedLeave : 0;
    };
    const getPendingLeaveByType = (type) => {
        const leave = leaveData.find((item) => item.Leavetype === type);
        return leave ? leave.pendingLeave : 0;
    };

    const calculateLeaveDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const difference = end - start;
        return Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1; // Includes the end date
    };

    const handleLeaveButtonClick = (type) => {
        setLeaveType(type);
        setAvailedLeave(0);
        setPendingLeave(getPendingLeaveByType(type));
    };

    const handleDateChange = () => {
        if (startDate && endDate) {
            const appliedLeaveDays = calculateLeaveDays(startDate, endDate);
            setAvailedLeave(appliedLeaveDays);
            const assignedLeave = getAssignedLeaveByType(leaveType);
            setPendingLeave(assignedLeave - appliedLeaveDays);
        }
    };

    const sendLeaveRequestEmailToManager = async (EmpID, leaveType, startDate, endDate, totalnoofdays,reason) => {
        try {
            await axios.post('http://localhost:3002/api/sendLeaveRequestEmail', {
                EmpID,
                leaveType,
                startDate,
                endDate,
                totalnoofdays,
                reason,
            });
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!leaveType || !startDate || !endDate ||!reason) {
            setMessage("Error: All fields are required.");
            return;
        }

        // Ensure EmpID is loaded
        if (!EmpID) {
            setMessage('Error: Employee ID not found.');
            return;
        }

        // Calculate total number of leave days
        const leaveDays = calculateLeaveDays(startDate, endDate);
        console.log('Calculated Leave Days:', leaveDays);

        try {
            // Find the leave balance record for the logged-in user based on leave type
            const leaveBalanceRecord = leaveData.find(record => record.Leavetype === leaveType && record.EmpID === EmpID);

            // Check if leave balance record exists
            if (!leaveBalanceRecord) {
                setMessage('Error: Leave balance record not found.');
                return;
            }

            // Log the found leave balance record
            console.log('Leave Balance Record:', leaveBalanceRecord);

            const { leavebalanceid, AssignedLeave, AvailedLeave } = leaveBalanceRecord;
            console.log('Leave Balance ID:', leavebalanceid);

            // Ensure leavebalanceid is valid before submitting the request
            if (!leavebalanceid) {
                setMessage('Error: Leave balance ID is invalid or not found.');
                return;
            }

            // Calculate updated leave balance
           // const updatedAssignedLeave = AssignedLeave - leaveDays;
            const assignedLeave= AssignedLeave;
            const updatedAvailedLeave = AvailedLeave + leaveDays;
            const updatedPendingLeave = AssignedLeave - updatedAvailedLeave;

            // Update leave balance data in the database
            await axios.patch(`http://localhost:3002/api/leave_balance/${leavebalanceid}`, {
                AssignedLeave: AssignedLeave,
                AvailedLeave: updatedAvailedLeave,
                PendingLeave: updatedPendingLeave,
            });

            // Prepare the leave request payload with correct leavebalanceid
            const leaveRequestPayload = {
              //  empid: EmpID,  // Employee ID
                EmpID: leaveBalanceRecord.EmpID,  // Email of the employee
                Leavetype: leaveType,  // Leave type
                startdate: startDate,  // Start date of the leave
                enddate: endDate,  // End date of the leave
                reason: reason,  // Reason for the leave
                status: 'pending',  // Leave status
                leavebalanceid: leavebalanceid,  // Correct Leave balance ID
                totalnoofdays: leaveDays,  // Total leave days
            };

            console.log('Leave Request Payload:', leaveRequestPayload);

            // Submit the leave request
            await axios.post('http://localhost:3002/api/leaverequest', leaveRequestPayload);

            // Send email notification (you should define this function)
            await sendLeaveRequestEmailToManager(EmpID, leaveType, startDate, endDate, leaveDays,reason, );

            // Reset the form fields after submission
            alert("Leave application submitted and email sent successfully.");
            setStartDate('');
            setEndDate('');
            setReason('');
            setAvailedLeave(0);
            settotalnoofdays('');
            setPendingLeave(0);
            setLeaveType('');
            navigate('/LeaveSubmitted', { state: { EmpID } });
        } catch (error) {
            console.error('Error during leave request submission:', error);
            setMessage('Error submitting leave request: ' + error.message);
        }
    };



    return (
        <>
            <Header title="Apply Leave Screen" />
            <div className="leave-options">
                <button className="paidtimeoff" onClick={() => handleLeaveButtonClick("Paid Time Off")}>
                    Paid Time off  <i className="fas fa-arrow-right"></i>
                    {loading ? "Loading..." : `${getPendingLeaveByType("Paid Time Off")} days`}
                </button>
                <button className="Sickoff" onClick={() => handleLeaveButtonClick("Sick Leave")}>
                    Sick Leave <i className="fas fa-arrow-right"></i>
                    {loading ? "Loading..." : `${getPendingLeaveByType("Sick Leave")} days`}
                </button>
            </div>
            <h2 className="Leavetype">Leave type:</h2>
            <div className="apply-leave-container">
                {message && <p className="message">{message}</p>}
                <input
                    type="text"
                    className="leave-type-input"
                    placeholder="Select the leave type"
                    value={leaveType}
                    disabled
                />
            </div>

            <div className="startdate">
                <label htmlFor="startDate">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    className="date-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onBlur={handleDateChange}
                />
            </div>

            <div className="enddate">
                <label htmlFor="endDate">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    className="date-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onBlur={handleDateChange}
                />
            </div>

            <div className="reason">
                <label htmlFor="reason">Reason:</label>
                <input
                    id="reason"
                    className="leave-type-input1"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter the reason for your leave"
                />
            </div>

            <div className="TNAL">
                <label>Total number of leave applied:</label>
                <span className="leave-summary-text">
                    {availedLeave} days
                </span>
            </div>

            <div className="TNPL">
                <label>Total number of pending leave:</label>
                <span className="leave-summary-text">
                    {pendingLeave} days
                </span>
            </div>

            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </>
    );
}

export default ApplyLeave;
