import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import { useAuth } from '../../EmployeeRecords/AuthContext/AuthContext';
import axios from 'axios';
import './LeaveSubmittedScreen.css';
import { useNavigate } from 'react-router-dom';

const LeaveSubmittedScreen = () => {
    const { EmpID } = useAuth();  // Get the logged-in user's EmpID from context
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();



    const handleClick = () => {
        navigate('/Leavebalance');
    };
    useEffect(() => {
        if (!EmpID) {
            console.log('No EmpID found, waiting for user login...');
            setLoading(false);
            return;
        }

        const fetchLeaveRequests = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:3002/api/leaverequest`, {
                    params: { EmpID}
                });

                // Filter leave requests for the logged-in user
                const userLeaveRequests = response.data.filter(request => request.EmpID === EmpID);

                if (userLeaveRequests && userLeaveRequests.length > 0) {
                    setLeaveRequests(userLeaveRequests);
                    setFilteredRequests(userLeaveRequests);
                } else {
                    setError('No leave requests found for this user.');
                }
            } catch (error) {
                console.error('Error fetching leave requests:', error);
                setError('Error fetching leave requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveRequests();
    }, [EmpID]);

    // Update filtered requests based on status filter
    useEffect(() => {
        if (statusFilter === '') {
            setFilteredRequests(leaveRequests);
        } else {
            setFilteredRequests(leaveRequests.filter(request =>
                request.status.toLowerCase() === statusFilter.toLowerCase()
            ));
        }
    }, [statusFilter, leaveRequests]);

    return (
        <>
            <Header title="Leave Request Submitted" />
            <div className="leave-submitted-container">
                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error">{error}</div>}

                <div className="filter-buttons">
                    <button className="pending" onClick={() => setStatusFilter('pending')}>Pending</button>
                    <button className="approved" onClick={() => setStatusFilter('approved')}>Approved</button>
                    <button className="reject" onClick={() => setStatusFilter('reject')}>Rejected</button>
                </div>

                <div className="leave-requests">
                    <table>
                        <thead>
                            <tr>
                                <th>EmpID</th>
                                <th>Leave Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Total No. of Leaves</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No leave requests found for this user.</td>
                                </tr>
                            ) : (
                                filteredRequests.map((leaveRequest) => (
                                    <tr key={leaveRequest.leaverequestid}>
                                        <td>{leaveRequest.EmpID}</td>
                                        <td>{leaveRequest.Leavetype}</td>
                                        <td>{new Date(leaveRequest.startdate).toLocaleDateString()}</td>
                                        <td>{new Date(leaveRequest.enddate).toLocaleDateString()}</td>
                                        <td>{leaveRequest.totalnoofdays}</td>
                                        <td>{leaveRequest.reason}</td>
                                        <td>{leaveRequest.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <button onClick={handleClick} className="applyleaves">
                     Dashboard
                    </button>
                </div>
            </div>
        </>
    );
};

export default LeaveSubmittedScreen;
