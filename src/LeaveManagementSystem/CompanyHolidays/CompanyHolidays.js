import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CompanyHolidays.css"

const CompanyHolidays = ({ role }) => {
    const [holidays, setHolidays] = useState([]);
    const [filteredHolidays, setFilteredHolidays] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [holidayDetails, setHolidayDetails] = useState({
        month: '',
        name: '',
        date: '',
    });

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/holidays');
                setHolidays(response.data);
                setFilteredHolidays(response.data);
            } catch (error) {
                console.error("Error fetching holidays:", error);
            }
        };

        fetchHolidays();
    }, []);

    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);
        if (month) {
            const filtered = holidays.filter(holiday => holiday.month === month);
            setFilteredHolidays(filtered);
        } else {
            setFilteredHolidays(holidays);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setHolidayDetails({
            ...holidayDetails,
            [name]: value,
        });
    };

    const handleSaveHoliday = () => {
        // You can handle the saving logic here
        console.log("Holiday Details:", holidayDetails);
        setShowPopup(false);
        // Optionally, you can reset holidayDetails or update the holidays state
    };

    return (
        <div className="company-holidays">
            <div className="month-selector">
                <label htmlFor="month">Select Month: </label>
                <select id="month" value={selectedMonth} onChange={handleMonthChange}>
                    <option value="">All Months</option>
                    {Array.from(new Set(holidays.map(h => h.month))).map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                    <option value="clear">Clear</option>
                </select>
            </div>

            <div className="holiday-container">
                {filteredHolidays.map((holiday, index) => (
                    <div key={index} className="month-row">
                        <div className="month-header">{holiday.month}</div>
                        <div className="holiday-box">
                            <div className="holiday-item">
                                {holiday.holidayName} - {new Date(holiday.holidayDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Only render the "Add Holiday" button if the user is an admin */}
            {role === "Admin" && (
                <button className="add-holiday-button" onClick={() => setShowPopup(true)}>
                    Add Holiday
                </button>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Add Holiday</h2>
                        <div className="popup-field">
                            <label htmlFor="month">Month Name:</label>
                            <select
                                name="month"
                                value={holidayDetails.month}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a Month</option>
                                {Array.from(new Set(holidays.map(h => h.month))).map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="popup-field">
                            <label htmlFor="name">Holiday Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={holidayDetails.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="popup-field">
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={holidayDetails.date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="popup-actions">
                            <button onClick={handleSaveHoliday}>Save</button>
                            <button onClick={() => setShowPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
  );
};

export default CompanyHolidays;
