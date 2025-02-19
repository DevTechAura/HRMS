import React, { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import './LeaveApprover.css';
import axios from 'axios';
import { useAuth } from '../../EmployeeRecords/AuthContext/AuthContext'; // Importing useAuth to access EmpID and role

const ManageLeaveRequests = () => {
    const { role, EmpID } = useAuth();  // Destructure EmpID and role from the context
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [leaverequestid, setLeaverequestid] = useState(null);  // Track the selected leave request ID
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if (role !== 'Manager') {
            setMessage('Access denied: You are not authorized to manage leave requests.');
            return;  // If the user is not a manager, return early
        }
        fetchLeaveRequests();
    }, [role]);  // Fetch leave requests whenever role changes

    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/leaverequest');
            setLeaveRequests(response.data);
        } catch (error) {
            setMessage('Error fetching leave requests: ' + error.message);
        }
    };

    const sendEmailNotification = async (email, status) => {
        try {
            const response = await axios.post('http://localhost:3002/sendEmail', {
                email: email,
                status: status,
            });
            console.log('Email sent:', response.data);
        } catch (error) {
            setMessage('Error sending email: ' + error.message);
        }
    };

    const handleApproval = async (leaverequestid, email) => {
        setLoading(true);
        try {
            const response = await axios.patch(`http://localhost:3002/api/leaverequest/${leaverequestid}`, {
                status: 'approved',
            });
            setLeaveRequests(prevRequests =>
                prevRequests.map(request =>
                    request.leaverequestid === leaverequestid ? { ...request, status: 'approved' } : request
                )
            );
            sendEmailNotification(email, 'Your leave has been approved by your manager.');
        } catch (error) {
            setMessage('Error approving leave request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRejection = async (leaverequestid, email) => {
        setLoading(true);
        try {
            const response = await axios.patch(`http://localhost:3002/api/leaverequest/${leaverequestid}`, {
                status: 'rejected',
            });
            setLeaveRequests(prevRequests =>
                prevRequests.map(request =>
                    request.leaverequestid === leaverequestid ? { ...request, status: 'rejected' } : request
                )
            );
            sendEmailNotification(email, 'Your leave has been rejected by your manager.');
        } catch (error) {
            alert('Error rejecting leave request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle the popup for adding comments
    const openCommentPopup = (leaverequestid) => {
        setLeaverequestid(leaverequestid); // Set the selected leave request ID
        setShowPopup(true);
    };

    const handleSaveComment = async () => {
        if (!commentText) {
            alert('Please enter a comment.');
            return;
        }

        try {
            // Send PATCH request to update the comments
            const response = await axios.patch(`http://localhost:3002/api/leaverequest/${leaverequestid}`, {
                comments: commentText, // Send the comment in the request body
            });

            // Check if the response indicates success
            if (response.status === 200) {
                // Update the state to reflect the new comment in the leave request
                setLeaveRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.leaverequestid === leaverequestid ? { ...request, comments: commentText, isCommented: true } : request
                    )
                );
                setShowPopup(false); // Close the popup after saving
                setCommentText(''); // Clear the comment text box
            } else {
                alert('Failed to update comment.');
            }
        } catch (error) {
            alert('Error saving comment: ' + error.message);
        }
    };

    return (
        <>
            <Header title="Leave Request Management" />
            <div>
                <br />
                {message && <p>{message}</p>}
                <table className="approverscreentable">
                    <thead>
                        <tr>
                            <th>EmpID</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Days</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Comments</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequests.map(request => (
                            <tr key={request.leaverequestid}>
                                <td>{request.EmpID}</td>
                                <td>{request.Leavetype}</td>
                                <td>{new Date(request.startdate).toLocaleDateString()}</td>
                                <td>{new Date(request.enddate).toLocaleDateString()}</td>
                                <td>{request.totalnoofdays}</td>
                                <td>{request.reason}</td>
                                <td>{request.status}</td>
                                <td>
                                    {request.comments ? (
                                        <span>{request.comments}</span>
                                    ) : (
                                        <button
                                            className="comments"
                                            onClick={() => openCommentPopup(request.leaverequestid)}
                                            disabled={request.isCommented} // Disable if comment is already added
                                        >
                                            {request.isCommented ? 'Commented' : 'Add Comment'}
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {request.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApproval(request.leaverequestid, request.email)}
                                                disabled={loading}
                                                className="approve-btn"
                                            >
                                                {loading ? 'Approving...' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleRejection(request.leaverequestid, request.email)}
                                                disabled={loading}
                                                className="reject-btn"
                                            >
                                                {loading ? 'Rejecting...' : 'Reject'}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Popup for adding comments */}
                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h3>Add Comment</h3>
                            <label className="lablename">Comments:</label>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                style={{ width: '300px', height: '150px' }}
                                placeholder="Enter your comment here..."
                            ></textarea>
                            <br />
                            <button className="commentbutton1" onClick={handleSaveComment}>Save</button>
                            <button className="commentbutton2" onClick={() => setShowPopup(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageLeaveRequests;
