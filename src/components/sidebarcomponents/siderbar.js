import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ onEmployeeRecordClick, onLeaveManagementClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleLeaveManagementClick = () => {
        navigate('/Leavebalance');
         // Navigate to Leave Management Homepage
    };
    return (
        <div className="sidebar">
            <h2 className="iproinfinity">i-pro infinity</h2>
            
            <ul>
                <li>
                    <span className="sidebarfirsttext" onClick={onEmployeeRecordClick}>
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                    </span>
                </li>
               
                <li> <Link
                    to="/EmployeeDataView"
                    className={location.pathname === '/EmployeeDataView' ? 'active' : ''}
                >
                    <span className='sidebarfivetexts'>
                        <i className="fas fa-briefcase"></i> Recruitment
                    </span>
                </Link></li>
                 <li>
                                            <Link
                        to="/EmployeeDataView"
                        className={location.pathname === '/' ? 'active' : ''}
                                            >
                                                <span className='sidebarfivetexts'>
                            <i className="fas fa-users"></i> Employee Records
                                                </span>
                                            </Link>
                                        </li>
                {/* <li>
                    <span className="sidebarfirsttext" onClick={onEmployeeRecordClick}>
                        <i className="fas fa-users"></i> Employee Records
                    </span>
                </li> */}

                <li>
                    <Link
                        to="/Leavebalance"
                        className={location.pathname === '/Leavebalance' ? 'active' : ''}
                    >
                        <span className='sidebarfivetexts'>
                            <i className="fas fa-calendar-check"></i> Leave Management
                        </span>
                    </Link>
                </li>

                {/* <li>
                    <span className="sidebarsectext" onClick={handleLeaveManagementClick}>
                        <i className="fas fa-calendar-check"></i> Leave Management
                    </span>
                </li> */}
                <li>
                    <span className="sidebarthirdtext">
                        <i className="fas fa-clock"></i> Time Tracker
                    </span>
                </li>
                <li>
                    <span className="sidebarfourthtext">
                        <i className="fas fa-file-invoice"></i> Payslip
                    </span>
                </li>
                <li>
                    <span className="sidebarfivtext">
                        <i className="fas fa-chalkboard-teacher"></i> Training
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
