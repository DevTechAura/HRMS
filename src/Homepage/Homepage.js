import React, { useState, useEffect } from 'react';
import { useAuth } from '../EmployeeRecords/AuthContext/AuthContext'; // Ensure you have access to Auth context
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { Link, useLocation } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css'; // Import FontAwesome

const Homepage = () => {
    const { role, EmpID } = useAuth(); // Access the user's role and EmpID from Auth context
    const navigate = useNavigate();
    console.log('Logged in user:', { EmpID, role });

    const [showPopup, setShowPopup] = useState(false);
    
    const [eventDetails, setEventDetails] = useState({
        title: "",
        date: "",
        time: "",
    });


    

    const location = useLocation(); 

    const [profileImage, setProfileImage] = useState(null); // State to store the selected profile image
    const [userName, setUserName] = useState(''); // State to store the user's name
    
    const [savedMeetings, setSavedMeetings] = useState([]);

    
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today); 
   

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get current month and year
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Get the name of the month
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    // Get the days of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the day of the week the month starts on
    const firstDay = new Date(year, month, 1).getDay();

    // Create an array of days for the calendar grid
    const daysArray = new Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // Move to the next month
    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Move to the previous month
    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [events, setEvents] = useState([]); // Store saved events

    const handlePlusClick = () => {
        setIsPopupOpen(true);
    };

    const handleCloseClick = () => {
        setIsPopupOpen(false);
    };

    const handleSaveClick = () => {
        if (title && date && time) {
            // Add new event to events state
            setEvents([...events, { title, date, time }]);
            setIsPopupOpen(false); // Close popup after saving
            setTitle("");
            setDate("");
            setTime("");
        } else {
            alert("Please fill all fields before saving.");
        }
    };

    
    const [showSearch, setShowSearch] = useState(false);

    const handleSearchClick = () => {
        setShowSearch(!showSearch);
    };
   
    useEffect(() => {
        // Fetch the user data after login, assuming the user's name is stored in the local storage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUserName(userData.name);
        }
    }, []);
    const handleLeaveManagementClick = () => {
        navigate('/Leavebalance'); // Navigate to Leave Management Homepage
    };

    const handleEmployeeRecordClick = () => {
        console.log('Navigating with EmpID:', EmpID); // Log the EmpID before navigation

        if (role === 'Employee') {
            navigate('/updateemployee', { state: { EmpID } }); // Pass EmpID when role is Employee
        } else if (role === 'Admin') {
            navigate('/EmployeeDataView'); // Admin role redirects to EmployeeDataView
        }
    };
    // Handle profile picture change
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
        <div className="homepage-body">
        <div className='dashboard'>Dashboard</div>
        {/* <li>
                                                    <Link
                                to="/EmployeeDataView"
                                className={location.pathname === '/EmployeeDataView' ? 'active' : ''}
                                                    >
                                                        <span className='sidebarfivetexts'>
                                    <i className="fas fa-users"></i> Employee Records
                                                        </span>
                                                    </Link>
                                                </li> */}
        <div className="homepage-container">
            {/* Sidebar */}
            <div className="sidebar">
                <h2 className='iproinfinity'>i-pro infinity</h2>
                <ul>
                        <li>
                            <Link
                                to="/Homepage"
                                className={location.pathname === '/Homepage' ? 'active' : ''}
                            >
                                <span className='sidebarfivetexts'>
                                    <i className="fas fa-tachometer-alt"></i> Dashboard
                                </span>
                            </Link>
                        </li>
                        <li><span className='sidebarrecruitmenttext'><i className="fas fa-briefcase"></i> Recruitment</span></li>
                        <li><span className='sidebarfirsttext' onClick={handleEmployeeRecordClick}><i className="fas fa-users"></i> Employee Records</span></li>
                        <li><span className='sidebarsectext' onClick={handleLeaveManagementClick}><i className="fas fa-calendar-check"></i> Leave Management</span></li>
                        <li><span className='sidebarthirdtext'><i className="fas fa-clock"></i> Time Tracker</span></li>
                        <li><span className='sidebarfourthtext'><i className="fas fa-file-invoice"></i> Payslip</span></li>
                        <li><span className='sidebarfivtext'><i className="fas fa-chalkboard-teacher"></i> Training</span></li>
                          {/* Added Recruitment with icon */}
                </ul>
            </div>

            <div className="boxcontain1"></div>
                <div className="boxcontain2"></div>
                <div className="boxcontain3"></div>
                <div className="boxcontain4"></div>
                <div className="boxcontain5">
                    {/* Header Section */}
                    <div className="headerscalender">
                        <h2>Calendar</h2>
                        <div className="newicon">
                            <i
                                className="fas fa-search"
                                onClick={handleSearchClick}
                                style={{ cursor: "pointer" }}
                            ></i>
                        </div>
                            <div className='newplusicon'>
                            <i
                                className="fas fa-plus"
                                onClick={handlePlusClick}
                                style={{ cursor: "pointer" }}
                            ></i>
                            </div>
                      
                        <div className="eventsshow">
                            {events.map((event, index) => (
                                <div key={index} className="eventshowtext">
                                    <strong>Title:</strong> {event.title} <br />
                                    <strong>Date:</strong> {event.date} <br />
                                    <strong>Time:</strong> <span className="time-display">{event.time}</span>
                                </div>
                            ))}
                        </div>
                   
                    </div>

                   

                    {/* Search Box */}
                    {showSearch && (
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search"
                                className="search-input"
                            />
                        </div>
                    )}

                    {/* Month Navigation */}
                    <div className="month-navigation">
                        <button onClick={prevMonth} className="arrow-btn">
                            &lt;
                        </button>
                        <div className="month-name">
                            {monthName} {year}
                        </div>
                        <button onClick={nextMonth} className="arrow-btn1">
                            &gt;
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="weekdays">
                        {weekDays.map((day, index) => (
                            <span key={index} className="weekday">
                                {day}
                            </span>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="calendar">
                        {daysArray.map((day, index) => (
                            <span
                                key={index}
                                className={`day ${day === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? 'current-day' : ''}`}
                            >
                                {day || ''}
                            </span>
                        ))}
                    </div>
                    
                </div>

            <div className="boxcontain6"></div>

            {/* Main Content */}
            <div className="container">
                <div className="headerbox">
                    {/* User Profile */}
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

                        {isPopupOpen && (
                            <div className="popup-container">
                                <div className="popup-content">
                                    <h3 className="popup-title">Add Event</h3>
                                    <div className="popup-form-group">
                                        <label className="popup-label">Title:</label>
                                        <input
                                            type="text"
                                            className="popup-textbox"
                                            placeholder="Enter title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="popup-form-group">
                                        <label className="popup-label">Date:</label>
                                        <input
                                            type="date"
                                            className="popup-datepicker"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="popup-form-group">
                                        <label className="popup-label">Time:</label>
                                        <input
                                            type="time"
                                            className="popup-timepicker"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </div>
                                    <div className="popup-buttons">
                                        <button className="popup-save-btn" onClick={handleSaveClick}>
                                            Save
                                        </button>
                                        <button className="popup-close-btn" onClick={handleCloseClick}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                      
                       
                        
                </div>

                    


            </div>
        </div>
        </div>
    );
};

export default Homepage;
