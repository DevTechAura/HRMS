import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../EmployeeRecords/AuthContext/AuthContext'; // Importing useAuth to access EmpID and role
import Sidebar from '../../components/sidebarcomponents/siderbar';
import { useNavigate } from 'react-router-dom';

import './LeaveBalance.css';

const LeaveBalance = () => {
    const { role, EmpID } = useAuth();  // Destructure EmpID and role from the context
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [message, setMessage] = useState('');
    const [userRole, setUserRole] = useState(role);  // Initialize userRole with role from context
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [filteredHolidays, setFilteredHolidays] = useState([]);


    const navigate = useNavigate();

    const [employee, setEmployee] = useState({});

    const handleClick = () => {
        navigate('/ApplyleaveScreen');
    };

    const handleClickcompanybalance = () => {
        navigate('/companyholidays');
    };

    const handleClickApprover = () => {
        if (userRole === 'Manager') {
            navigate('/approveleave');
        }
    };
    const handleEmployeeRecordClick = () => {
        console.log("Employee Records Clicked");
    };

    const handleLeaveManagementClick = () => {
        console.log("Leave Management Clicked");
    };
    const handleClickStatus = () => {
        navigate('/LeaveSubmitted');
    };
 const [userName, setUserName] = useState(''); 
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        setUserRole(role);  // Update the userRole whenever the role changes
        fetchLeaveBalance();
    }, [role]);  // Run the effect whenever role changes

    useEffect(() => {
        // Fetch data from the API
        axios
            .get("http://localhost:3002/employeerecord")
            .then((response) => {
                if (response.data.success && response.data.data.length > 0) {
                    // Assuming you want to show the first employee record
                    setEmployee(response.data.data[0]);
                }
            })
            .catch((error) => {
                console.error("Error fetching employee data:", error);
            });
    }, []);

    const fetchLeaveBalance = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/api/leave_balance?EmpID=${EmpID}`);
            // Filter the data to only include the logged-in user's records
            const userLeaveBalance = response.data.filter(
                (record) => record.EmpID === EmpID
            );
            setLeaveBalance(userLeaveBalance);
        } catch (error) {
            setMessage('Error fetching leave balance: ' + error.message);
        }
    };

    useEffect(() => {
        fetch('http://localhost:3002/api/holidays')
            .then(response => response.json())
            .then(data => {
                // Get current month
                const currentMonth = new Date().toLocaleString('default', { month: 'long' });

                // Filter holidays for the current month
                const currentMonthHolidays = data.filter(holiday => holiday.month === currentMonth);
                console.log('Current month holidays:', currentMonthHolidays);

                // If needed, set this data to your state
                setFilteredHolidays(currentMonthHolidays);
            })
            .catch(error => console.error('Error fetching holidays:', error));
    }, []);


    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); // Set the selected image as the profile image
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <>
            
            <div>
                <div className="profile-container">
                    <input
                        type="file"
                        accept="image/*"
                        id="profile-image-input"
                        style={{ display: 'none' }}
                        onChange={handleProfileImageChange}
                    />
                    <label htmlFor="profile-image-input">
                        <div className="sidebarprofile-icon">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <div className="default-profile-icon">
                                    <i className="fa fa-user" style={{ fontSize: '30px', color: '#ffffff' }}></i>
                                </div>
                            )}
                        </div>
                    </label>
                    {/* Displaying User's Name and Welcome Message */}
                    {userName && (
                        <div className="user-details">
                            <h3 className='newusername'>{userName}</h3>
                            <p className='welcomehrms'>Welcome back to i-pro infinity</p>
                        </div>
                    )}
                </div>
                <div className="homepage-body">
                <Sidebar
                    onEmployeeRecordClick={handleEmployeeRecordClick}
                    onLeaveManagementClick={handleLeaveManagementClick}
                />
                <br />
                <br />
                {message && <p>{message}</p>}
                    <div className="firstgridLB">
                        <div className="headerRow">
                            <label className="Enamelb">Employee Name</label>
                            <label className="Eidlb">Employee ID</label>
                            <label className="Edeplb">Department</label>
                            <label className="Ejoiningdatelb">Joining Date</label>
                        </div>
                        {employee && (
                            <div className="dataRow">
                                <span className="Enamelbd">{`${employee.FirstName} ${employee.LastName}`}</span>
                                <span className="Eidlbd">{employee.EmpID}</span>
                                <span className="Edeplbd">{employee.department}</span>
                                <span className="Ejoiningdatelbd">
                                    {new Date(employee.dateOfJoining).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                <div className='secondgridlb'>
                        <span className="Ename2grid">{`${employee.FirstName} ${employee.LastName}`} - <i>Leaves</i></span>
                        <div className='annualleavelb'>
                            <p className='annualleavelbtext'>Annual Leaves</p>
                            <div className='assignedleavebox'>
                                <span className='assignedleavetext'>{leaveBalance.find(lb => lb.Leavetype === "Annual Leaves")?.AssignedLeave || 0}</span>
                            </div>
                        </div>

                        <div className='medicalleavelb'>
                            <p className='medicallbtext'>Medical Leaves</p>
                            <div className='assignedleavebox'>
                                <span className='pendingleavetext'>{leaveBalance.find(lb => lb.Leavetype === "Medical Leaves")?.AssignedLeave || 0}</span>
                            </div>
                        </div>

                        <div className='casuallb'>
                            <p className='casualtext'>Casual Leaves</p>
                            <div className='assignedleavebox'>
                                <span className='pendingleavetext'>{leaveBalance.find(lb => lb.Leavetype === "Casual Leaves")?.AssignedLeave || 0}</span>
                            </div>
                        </div>

                        <div className='remaininglb'>
                            <p className='remainingtext'>Remaining Leaves</p>
                            <div className='assignedleavebox'>
                                <span className='pendingleavetext'>{leaveBalance.find(lb => lb.Leavetype === "Sick Leave")?.pendingLeave || 0}</span>
                            </div>
                        </div>
                </div>

                <div className='thirdgirdlb'>
                        <table>
                            <thead className='Leave-head'>
                                <tr>
                                    <th>EmpID</th>
                                    <th>LeaveType</th>
                                    <th>Assigned Leave</th>
                                    <th>Carryforward Leave</th>
                                    <th>Availed Leave</th>
                                    <th>Pending Leaves</th>
                                </tr>
                            </thead>
                            <tbody className='Leave-body'>
                                {leaveBalance.map((record) => (
                                    <tr key={record.leavebalanceid}>
                                        <td>{record.EmpID}</td>
                                        <td>{record.Leavetype}</td>
                                        <td>{record.AssignedLeave}</td>
                                        <td>{record.CarryforwardBalance}</td>
                                        <td>{record.AvailedLeave}</td>
                                        <td>{record.pendingLeave}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> 
                       
                </div>
                    <div className='fourthgirdlb'>
                        <div className='company-holiday'>Company holidays</div>
                        <div className='holiday-list'>
                            <ul>
                                {filteredHolidays.length > 0 ? (
                                    filteredHolidays.map((holiday, index) => (
                                        <li key={index} className='holiday-item'>
                                            {holiday.holidayName} ({new Date(holiday.holidayDate).toLocaleDateString()})
                                        </li>
                                    ))
                                ) : (
                                    <li className='holiday-item'>No holidays this month</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className='fivthgirdlb'></div>

                    <button onClick={handleClick} className="HRMS-applyleave">
                        Apply Leave
                    </button>
                {/* 
                {/* <button onClick={handleClick} className="applyleave">
                    Apply Leave
                </button>
                <button onClick={handleClickcompanybalance} className="Companyholidays">
                    Company Holidays
                </button>
                <button onClick={handleClickStatus} className="LeaveSubmitted ">
                    LeaveStatus
                </button>
                <button
                    className={`approver ${userRole !== 'Manager' ? 'disabled-button' : ''}`}
                    onClick={handleClickApprover}
                    disabled={userRole !== 'Manager'}
                >
                    Approver
                </button> */}
                </div>
            </div>
        </>
    );
};

export default LeaveBalance;
