import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeAddpopup.css';
import { useLocation } from 'react-router-dom';



const EmployeeAddpopup = ({ closeModal, fetchEmployeeRecords, employee }) => {
    const [countries, setCountries] = useState([]);
    const [state, setStates] = useState([]);
    const [city, setCity] = useState([]);
    const [jobdescription, setJobDescription] = useState("");
    const [country, setCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [pincode, setPincode] = useState('');

    const [error, setError] = useState('');



    // const [reportingmanager, setReportingManager] = useState(""); // Selected manager
    const [managers, setManagers] = useState(["Suresh", "Umesh"]); // Dropdown options
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility
    const [newManager, setNewManager] = useState("");



    // Declare contract state only once

    // State for storing the Part-Time working hours





    const [FirstName, setFirstName] = useState('');
    const [MiddleName, setMiddleName] = useState('');
    const [LastName, setLastName] = useState('');
    const [EmpID, setEmpID] = useState('');
    // Add other fields similarly...
    const [loading, setLoading] = useState(false);

    const [reportingmanager, setreportingmanager] = useState('');




    // State variables for employee data

    //const [EmpID, setEmpID] = useState('');
    const [department, setDepartment] = useState('');
    const [assignrole, setAssignrole] = useState('');
    // const [pincode, setpincode] = useState('');
    // const [email, setEmail] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    //const [dateOfJoining, setDateOfJoining] = useState('');
    const [Familycontact, setFamilycontact] = useState('');
    const [jobtitle, setjobtitle] = useState('');
    const [noticeperiod, setNoticeperiod] = useState('');
    const [Familyemail, setFamilyemail] = useState('');
    //const [employeementtype, setemployeementtype] = useState(false); // Default to 'No'


    //  const [dateOfExit, setDateOfExit] = useState('');
    const [address, setAddress] = useState('');
    const [permantaddress, setpermantaddress] = useState('');
    const [employmentStatus, setEmploymentStatus] = useState('Active');
    const [isViewMode, setIsViewMode] = useState(false);


    const [employeementtype, setemployeementtype] = useState('');
    const [fullTime, setFullTime] = useState(false);  // Declare fullTime state only once
    const [partTime, setPartTime] = useState(false);  // Declare partTime state only once
    const [contract, setContract] = useState(false);
    const [partTimeFrom, setPartTimeFrom] = useState('');
    const [partTimeTo, setPartTimeTo] = useState('');


    const [contractStartDate, setContractStartDate] = useState('');
    const [contractEndDate, setContractEndDate] = useState('');



    let employeeCounter = 1000; // Initialize with the starting number

    const generateNextEmployeeID = (stateAbbr) => {
        employeeCounter += 1; // Increment for every new employee
        return employeeCounter; // Return the next ID
    };

    const handleSaveManager = () => {
        if (newManager.trim() !== "") {
            setManagers([...managers, newManager]); // Add new manager to the list
            setNewManager(""); // Clear input
            setIsPopupOpen(false); // Close popup
        }
    };

    useEffect(() => {
        const fetchEmploymentType = async () => {
            try {
                const response = await fetch(`http://localhost:3002/getEmploymentType?employeeId=${EmpID}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.employmentType === "Full-Time") setFullTime(true);
                    if (data.employmentType === "Part-Time") setPartTime(true);
                    if (data.employmentType === "Contract") setContract(true);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching employment type:", error);
            }
        };

        fetchEmploymentType();
    }, []);

    const saveEmploymentType = async () => {
        try {
            const response = await fetch('http://localhost:3002/saveEmploymentType', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    EmpID: 'KA1046', // Hardcode a valid EmpID
                    employmentType: 'Full-Time', // Hardcode a valid type
                }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Server Response:", data); // Log success response
                alert(data.message);
            } else {
                console.error("Error Response:", data.message); // Log error response
            }
        } catch (error) {
            console.error("Fetch Error:", error); // Log network errors
        }
    };



    const handleEmploymentTypeChange = (type) => {
        // Reset all checkboxes
        setFullTime(type === "Full-Time");
        setPartTime(type === "Part-Time");
        setContract(type === "Contract");

        // Save the selected type
        saveEmploymentType(type);
    };


    // Use employee data from props for pre-population
    useEffect(() => {
        if (employee) {
            setFirstName(employee.FirstName || '');
            setMiddleName(employee.MiddleName || '');
            setLastName(employee.LastName || '');
            setEmpID(employee.EmpID || '');
            setDepartment(employee.department || '');
            setAssignrole(employee.assignrole || '');
            setFamilycontact(employee.Familycontact || '');
            setjobtitle(employee.jobtitle || '');
            setNoticeperiod(!employee.noticeperiod || '');
            setFamilyemail(employee.Familyemail || '');
            setemployeementtype(employee.employeementtype || '');
            setCity(employee.city || '');
            setJobDescription(employee.jobdescription || '');
            //setPincode(employee.pincode || '');
            setCountry(employee.country || '');
            //setEmail(employee.email || '');
            setPersonalEmail(employee.personalEmail || '');
            setMobileNumber(employee.mobileNumber || '');
            setPassword(employee.password || '');
            //setDateOfJoining(employee.dateOfJoining || '');
            //setDateOfExit(employee.dateOfExit || '');
            setAddress(employee.address || '');
            setEmploymentStatus(employee.employmentstatus || 'Active');
            setIsViewMode(!employee.EmpID);
            setContractEndDate(!employee.contractEndDate || '');
            setContractStartDate(!employee.contractStartDate || '');
            setpermantaddress(employee.permantaddress || ''); // Correctly set permanent address
            setreportingmanager(employee.reportingmanager || '');
            setPincode('');
            setStates(Array.isArray(employee.state) ? employee.state : []);
            setFullTime(!employee.fullTime || '');
            setPartTime(!employee.partTime || '');
            setPartTimeFrom(!employee.partTimeFrom || '');
            setPartTimeTo(!employee.partTimeTo || '');
            setContractStartDate(!employee.contractStartDate || '');
            setContractEndDate(!employee.contractEndDate || '');
        }
    }, [employee]);

    const handlePincodeChange = (event) => {
        const value = event.target.value;
        setPincode(value);
        setError('');
        setEmpID(''); // Reset EmpID when the pincode changes

        // Only fetch location data if the pincode is 6 digits
        if (value.length === 6) {
            setError(''); // Reset error
        }
    };

    useEffect(() => {
        if (pincode.length === 6) {
            const fetchLocationData = async () => {
                try {
                    const response = await axios.get(`https://api.zippopotam.us/in/${pincode}`);
                    if (response.data && response.data.places && response.data.places.length > 0) {
                        const place = response.data.places[0];
                        //const country = 'India'; // Hardcoding the country as it's always India in this API
                        const state = place.state;
                        const city = place['place name'] || 'Not Available'; // Adjusting key based on API response

                        setStates([state]);
                        setCity(city === 'Not Available' ? [] : [city]);
                        // setCountry(country);
                        setSelectedState(state);
                        setSelectedCity(city === 'Not Available' ? '' : city);

                        // Generate EmpID
                        const stateAbbr = state.slice(0, 2).toUpperCase(); // Get the state abbreviation
                        const empIDPrefix = stateAbbr;

                        // Get the last used EmpID for the state and increment it
                        const lastEmpID = await getLastEmpID(stateAbbr); // Function to fetch last EmpID for the state
                        const nextEmpID = lastEmpID ? `${empIDPrefix}${parseInt(lastEmpID.slice(2)) + 1}` : `${empIDPrefix}1001`;

                        setEmpID(nextEmpID); // Set the generated EmpID
                    } else {
                        setError('Invalid pincode. Please check and try again.');
                    }
                } catch (error) {
                    console.error('Error fetching location data:', error);
                    setError('Unable to fetch location data. Please try again later.');
                }
            };

            fetchLocationData();
        }
    }, [pincode]);

    // Function to get the last EmpID for the given state abbreviation
    const getLastEmpID = async (stateAbbr) => {
        try {
            // This function fetches the last EmpID for the state from your backend or another source.
            // Here, we're simulating that logic by checking a hardcoded list of EmpIDs.
            const lastEmpID = localStorage.getItem(`${stateAbbr}_lastEmpID`);

            if (lastEmpID) {
                return lastEmpID;
            } else {
                // If no EmpID found for the state, return null (will start from 1001)
                return null;
            }
        } catch (error) {
            console.error('Error fetching last EmpID:', error);
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isViewMode) return; // Avoid submission if in view mode

        const isEditing = !!employee; // Check if we are editing an employee record

        // Ensure MiddleName is not null or undefined
        const sanitizedMiddleName = MiddleName || ''; // Use empty string if MiddleName is missing

        // Basic form validation
        if (!FirstName || !LastName || !personalEmail || !mobileNumber) {
            alert('Please fill out all required fields.');
            return;
        }

        // Validate email format (simple validation)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(personalEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Optional: validate mobile number (simple check, can be enhanced)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobileNumber)) {
            alert('Please enter a valid mobile number.');
            return;
        }

        setLoading(true); // Set loading state

        try {
            let response;

            if (isEditing) {
                // Updating an existing employee
                console.log("Data being sent to the server:", employee);
                response = await axios.put(`http://localhost:3002/edit-employee/${EmpID}`, {
                    FirstName,
                    MiddleName,
                    LastName,
                    personalEmail,
                    mobileNumber,
                    password,
                    department,
                    assignrole,
                    Familycontact,
                    jobtitle,
                    noticeperiod,
                    Familyemail,
                    permantaddress,
                    contractStartDate,
                    contractEndDate,
                    employmentStatus,
                    country,
                    reportingmanager,
                    address,
                    pincode,
                    employeementtype,    // Employment type from toggle
                    fullTime,            // Full-Time flag
                    partTime,            // Part-Time flag
                    partTimeFrom,        // Part-Time From time
                    partTimeTo,          // Part-Time To time
                    contract,            // Contract flag
                    jobdescription,
                    city    // Employment type from toggle

                });
            } else {
                // Adding a new employee
                response = await axios.post(`http://localhost:3002/add-employee`, {
                    FirstName,
                    MiddleName: sanitizedMiddleName,
                    LastName,
                    EmpID,
                    personalEmail,
                    mobileNumber,
                    password,
                    department,
                    assignrole,
                    Familycontact,
                    jobtitle,
                    noticeperiod,
                    Familyemail,
                    permantaddress,
                    contractStartDate,
                    contractEndDate,
                    employmentStatus,
                    country,       // Ensure correct value is passed
                    reportingmanager,      // Ensure correct value is passed
                    address,
                    pincode,
                    employeementtype,
                    fullTime,
                    partTime,
                    partTimeFrom,
                    partTimeTo,
                    contract,
                    state,
                    jobdescription,
                    city,
                });

                // Store the new EmpID to local storage (simulate the backend update)
                localStorage.setItem(`${selectedState.slice(0, 2).toUpperCase()}_lastEmpID`, EmpID);
            }

            if (response.data.success) {
                alert(isEditing ? 'Employee record updated successfully!' : 'New employee added successfully!');
                fetchEmployeeRecords(); // Fetch updated employee records
            } else {
                alert('Failed to process employee data. Please try again.');
            }

            closeModal(); // Close the modal after processing

        } catch (error) {
            console.error('Error processing employee data:', error);
            alert('An error occurred while processing the employee data. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };



    return (
        <div className="pop-up-container">
            <form onSubmit={handleSubmit}>
                <div className="pop-up-content">
                <div className="firstnameEAP">
                    <label className='label'>First Name:</label>
                    <input  className='firstnameinputEAP'
                        type="text"
                        name="firstName"
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="MiddlenameEAP">
                    <label className='label'>MiddleName:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="MiddleName"
                        value={MiddleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                    />
                </div>
                <div className="LastnameEAP">
                    <label className='label'>Last Name:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="lastName"
                        value={LastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                {/* <div className="Loginemail1">
                    <label>Email:</label>
                    <input
                        type="text"
                        name="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div> */}

                <div className="PersonalEmailEAP">
                    <label className='label'>Personal Email:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="personalEmail"
                        value={personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                    />
                </div>

                <div className="MobileNumberEAP">
                    <label className='label'>Mobile Number:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="mobileNumber"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                    />
                </div>
                <div className="FamilyContactEAP">
                    <label className='label'>Family Contact:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="Familycontact"
                        value={Familycontact}
                        onChange={(e) => setFamilycontact(e.target.value)}
                    />
                </div>
                <div className="jobTitleEAP">
                    <label className='label'>Job Title:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="jobtitle"
                        value={jobtitle}
                        onChange={(e) => setjobtitle(e.target.value)}
                    />
                </div>
                <div className="FamilyemailEAP">
                    <label className='label'>Family Email:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="Familyemail"
                        value={Familyemail}
                        onChange={(e) => setFamilyemail(e.target.value)}
                    />
                </div>
                <div className="employeementtypeEAP">
                    <label className='label'>Employment Type: </label>
                    <div className="toggle-switch">
                        <label className="switch">
                            <input className='firstnameinputEAP'
                                type="checkbox"
                                name="employeementtype"
                                checked={employeementtype}
                                onChange={() =>
                                    setemployeementtype(!employeementtype) // Toggle between true (Yes) and false (No)
                                }
                            />
                            <span className="slider round"></span>
                        </label>
                        <span>{employeementtype}</span>
                    </div>
                </div>

                {/* Display the checkboxes only when employeementtype is 'Yes' */}
                {employeementtype && (
                    <div className="employment-details">
                        <div className="fulltimecheckbox">
                            <label>
                                <input className='firstnameinputEAP'
                                    type="checkbox"
                                    name="fullTime"
                                    checked={fullTime}
                                    onChange={() => handleEmploymentTypeChange("Full-Time")}
                                />
                                Full-Time
                            </label>
                        </div>

                        <div className="parttimecheckbox">
                            <label className='labelpartimecheckbox'>
                                <input className='firstnameinputEAP'
                                    type="checkbox"
                                    name="partTime"
                                    checked={partTime}
                                    onChange={() => handleEmploymentTypeChange("Part-Time")}
                                />
                                Part-Time
                            </label>

                            {partTime && (
                                <div>
                                    <label className="p1">From: </label>
                                    <input 
                                        className="parttime-timing"
                                        type="text"
                                        value={partTimeFrom}
                                        onChange={(e) => setPartTimeFrom(e.target.value)}
                                        placeholder="e.g. 9:00 AM"
                                    />
                                    <label className="p2">To: </label>
                                    <input
                                        className="parttime-timings"
                                        type="text"
                                        value={partTimeTo}
                                        onChange={(e) => setPartTimeTo(e.target.value)}
                                        placeholder="e.g. 1:00 PM"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="contractcheckbox">
                            <label className='label'>
                                <input className='firstnameinputEAP'
                                    type="checkbox"
                                    name="contract"
                                    checked={contract}
                                    onChange={() => handleEmploymentTypeChange("Contract")}
                                />
                                Contract
                            </label>

                            {contract && (
                                <div>
                                    <label className="contractStartDate">Joining Date: </label>
                                    <input
                                        className="contractStartDatePicker"
                                        type="date"
                                        value={contractStartDate}
                                        onChange={(e) => setContractStartDate(e.target.value)}
                                    />
                                    <label className="contractEndDate">Exit Date: </label>
                                    <input
                                        className="contractEndDatePicker"
                                        type="date"
                                        value={contractEndDate}
                                        onChange={(e) => setContractEndDate(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )
                };


                <div className="PasswordEAP">
                    <label className='label'>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="empIDEAP">
                    <label className='label'>EmpID:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        value={EmpID}
                        onChange={handlePincodeChange}
                        placeholder="Enter Pincode"
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}



                </div>

                <div className="departmentEAP">
                    <label className='label'>Department:</label>
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="Sales">Sales</option>
                        <option value="Accountant">Accountant</option>
                        <option value="HR">HR</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                </div>

                <div className="assign-roleEAP">
                    <label className='label'>Assign Role:</label>
                    <select
                        value={assignrole}
                        onChange={(e) => setAssignrole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>

                {/* <div className="DateOfJoining">
                    <label>Date of Joining:</label>
                    <input
                        type="date"
                        name="dateOfJoining"
                        value={dateOfJoining}
                        onChange={(e) => setDateOfJoining(e.target.value)}
                    />
                </div>

                <div className="DateOfExit">
                    <label>Date of Exit:</label>
                    <input
                        type="date"
                        name="dateOfExit"
                        value={dateOfExit}
                        onChange={(e) => setDateOfExit(e.target.value)}
                    />
                </div> */}

                <div className="pincodeEAP">
                    <label className='label'>Pincode:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                    />
                </div>

                <div className="addressEAP">
                    <label className='label'>address:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ height: '50px' }}
                    />
                </div>


                <div className="reportingmanagerEAP">
                    <label className='label'>Reporting Manager:</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <select
                            name="reportingmanager"
                            value={reportingmanager}
                            onChange={(e) => setreportingmanager(e.target.value)}
                            className="hrmss-select"
                        >
                            <option value="">Select Manager</option>
                            {managers.map((manager, index) => (
                                <option key={index} value={manager}>
                                    {manager}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setIsPopupOpen(true)}
                            className="hrmss-button"
                        >
                            +
                        </button>
                    </div>

                    {isPopupOpen && <div className="popupEAP-overlayEAP"></div>}

                    
                </div>

                <div className="permanentaddressEAP">
                    <label className='label'>Permanent address:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="permanentaddress"
                        value={permantaddress}
                        onChange={(e) => setpermantaddress(e.target.value)}
                        style={{ height: '100px' }}
                    />
                </div>
                <div className="countryDropdownEAP">
                    <label className='label'>Country:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}

                    />
                </div>


                <div className="stateDropdownEAP" style={{ width: '300px', height: '47px' }}>
                    <label className='label'>State:</label>
                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        style={{ width: '100%', height: '100%', borderRadius: '4px', border: '1px solid #ccc', padding: '8px' }}
                    >
                        <option value="">Select a state</option>
                        {state.map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div className="cityEAP">
                    <label className='label'>City:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="city"
                        value={city}
                        onChange={(e) => setCountry(e.target.value)}

                    />
                </div>
                <div className="noticeperiodEAP">
                    <label className='label'>Notice Period:</label>
                    <select
                        name="noticeperiod"
                        value={noticeperiod}
                        onChange={(e) => setNoticeperiod(e.target.value)}
                        style={{ width: '320px', height: '49px', padding: '5px', border: '1px solid #ccc', borderRadius: '10px' }}
                    >
                        <option value="">Select</option>
                        <option value="30 days">30 days</option>
                        <option value="60 days">60 days</option>
                        <option value="90 days">90 days</option>
                    </select>

                </div>

                <div className="jobdescription">
                    <label className='label'>Job Description:</label>
                    <input className='firstnameinputEAP'
                        type="text"
                        name="jobdescription"
                        value={jobdescription}
                        onChange={(e) => setJobDescription(e.target.value)} // Ensure this updates the state
                    />

                </div>

                <div className="buttonContainer">
                    <button className='popupcloseEAP' type="button" onClick={closeModal}>Close</button>
                    <button className='save-buttonEAP' type="submit">Save</button>
                </div>
                </div>
            </form>
            
        </div>
    );
};

export default EmployeeAddpopup;
