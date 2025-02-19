import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import lmsimage from "../../Images/Happy transition from work to 1.png";
import { useNavigate } from 'react-router-dom';
import './LMShomepage.css';

const LMShomepage = () => {
    const navigate = useNavigate();
   // const [email, setEmail] = useState(null);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [EmpID, setEmpId] = useState(null); // To store EmpID

    useEffect(() => {
       
        const userData = JSON.parse(localStorage.getItem('user'));

        if (userData && userData.email) {
            console.log("User logged in with email:", userData.EmpID);
            console.log("User role:", userData.role);
           // setEmail(userData.email);
            setUserRole(userData.role);
            setUserName(userData.name);

            // Fetch employee data from the database based on email
            fetch(`http://localhost:3002/api/employeerecord`)
                .then(response => response.json())
                .then(data => {
                    const user = data.find(item => item.EmpID === userData.EmpID);
                    if (user) {
                        setEmpId(user.EmpID); // Set EmpID from the database
                        console.log("EmpID:", user.EmpID);
                    } else {
                        console.error('User not found in employee records:', userData.EmpID);
                    }
                })
                .catch(error => console.error('Error fetching employee data:', error));

            // Fetch leave balance for the logged-in user
            fetch(`http://localhost:3002/api/leave_balance`)
                .then(response => response.json())
                .then(data => {
                    if (data && Array.isArray(data)) {
                        const userLeaveBalance = data.filter(leave => leave.EmpID === userData.EmpID);
                        if (userLeaveBalance.length > 0) {
                            const assignedLeave = userLeaveBalance.reduce((total, leave) => total + leave.AssignedLeave, 0);
                            setLeaveBalance(assignedLeave);
                        } else {
                            console.error('No leave balance data found for user:', userData.EmpID);
                        }
                    } else {
                        console.error('Failed to retrieve leave balance data:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching leave balance:', error));
        } else {
            console.error("User data not found in localStorage");
            navigate('/Homepage'); // Redirect to login if no user data found
        }
    }, [navigate]);

    const handleApproverClick = () => {
        if (userRole === 'Manager') {
            navigate('/approveleave');
        }
    };

    return (
        <>
            <Header title={"Leave Management System"} />
            <div className="lmsimage">
                <img src={lmsimage} className='image' alt="Website" />
            </div>
            <div>
                <button className="applyleave" onClick={() => navigate('/ApplyleaveScreen')}>Apply Leave</button>
                <button className="LeaveSubmitted" onClick={() => navigate('/LeaveSubmitted', { state: { EmpID } })}>Leave status</button>
                <button className="leavebalance" onClick={() => navigate('/Leavebalance')}>Leave Balance</button>
                <button className="Companyholidays" onClick={() => navigate('/companyholidays')}>Company Holidays</button>
                <button
                    className={`approver ${userRole !== 'Manager' ? 'disabled-button' : ''}`}
                    onClick={handleApproverClick}
                    disabled={userRole !== 'Manager'}
                >
                    Approver
                </button>
            </div>
        </>
    );
};

export default LMShomepage;
