import React, { useEffect, useState } from 'react';
import Header from '../../Header/Header'; // Importing your Header component
import { useLocation } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AttachmentEdit from './AttachmentEdit/AttachmentEdit';
import './AddEmployee.css'; // Include your CSS for styling if needed

const UpdateEmployee = () => {
    const location = useLocation(); // Get location object to access state
    const [employeeData, setEmployeeData] = useState(null); // State for employee data
    const EmpID = location.state?.EmpID; // Get email from state safely
    //const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [degreeCertificates, setdegreeCertificates] = useState('')
     
   
    
        const [formData, setFormData] = useState({
            date_of_birth:'',
            gender: '',
            adharano: '',
            bloodGroup: '',
            profile_image: '',

        });

        const [isEditable, setIsEditable] = useState({
            date_of_birth: true,
            gender: true,
            adharano: true,
            bloodGroup: true,
        });

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const [image, setImage] = useState(null);
    const [imageChanged, setImageChanged] = useState(false);
    const [savedFields, setSavedFields] = useState(new Set());
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'degreeCertificates') {
                setdegreeCertificates(file.name); // Update the degree file name
            }
        }
    };

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            if (!EmpID) {
                console.log('No EmpIDprovided to fetch employee details.'); // Log if no email
                return; // Exit the function if email is not defined
            }

            try {
                const response = await fetch('http://localhost:3002/api/employeerecord'); // Your correct endpoint
                const data = await response.json();

                // Find the employee by email passed from Homepage
                const employee = data.find(emp => emp.EmpID === EmpID);

                if (employee) {
                    setEmployeeData(employee); // Set employee data
                    // Initialize form data for empty fields
                    setFormData({
                        address: employee.address || '',
                        date_of_birth: employee.date_of_birth || '',
                        gender: employee.gender || '',
                        emergencycontact: employee.emergencycontact || '',
                        bloodGroup: employee.bloodGroup || '',
                        pan: employee.pan || '',
                        state: employee.state || '',
                        maritalstatus: employee.maritalstatus || '',
                        adharano: employee.adharano || '',
                        jobtitle: employee.jobtitle || '',
                        reportingmanager: employee.reportingmanager || '',
                        employmenttype: employee.employmenttype || '',
                        worklocation: employee.worklocation || '',
                        jobdescription: employee.jobdescription || '',
                        noticeperiod: employee.noticeperiod || '',
                        salary: employee.salary || '',
                        benefitsinformation: employee.benefitsinformation || '',
                        taxinformation: employee.taxinformation || '',
                        bankaccountno: employee.bankaccountno || '',
                        ifsccode: employee.ifsccode || '',
                        branchname: employee.branchname || '',
                        employmentstatus: employee.employmentstatus || '',
                        profile_image: employee.profile_image || '',
                        contractEndDate: employee.contractEndDate|| '',
                      
                        contractStartDate: employee.contractStartDate || '',
                        dateofExit: employee.dateofExit || '',
                        // Adding fields that were previously missing
                        department: employee.department || '',
                        assignrole: employee.assignrole || '',
                        EmpID: employee.EmpID || '',
                        personalEmail: employee.personalEmail || '',
                        complianceTraining: employee.complianceTraining || '',
                        employmentcontract: employee.employmentcontract || '',
                        degreeCertificates: employee.degreeCertificates || '',

                    });
                    setImage(employee.profile_image || '');
                } else {
                    console.log('No employee details found for the given EmpID .'); // Log if employee not found
                }
            } catch (error) {
                console.error('Error fetching employee details:', error);
            }
        };

        fetchEmployeeDetails();
    }, [EmpID]); // Dependency array includes email to re-fetch if it changes

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form data
        setFormData({
            ...formData,
            [name]: value,
        });

        // Disable further editing for the specific field
        setIsEditable({
            ...isEditable,
            [name]: false,
        });
       
        setFormData(prevData => ({ ...prevData, [name]: value })); // Update form data state
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set image preview URL
                setImageChanged(true); // Indicate image has been changed
            };
            reader.readAsDataURL(file); // Read the file as data URL for preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
           
            const response = await fetch(`http://localhost:3002/api/employeerecord/${employeeData.EmpID}`, {
                method: 'PUT',
                profile_image: image || formData.profile_image, 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json(); // Capture response data for debugging

            if (response.ok) {
                alert('Employee details updated successfully.');

                setSavedFields(new Set(Object.keys(formData)));
                setIsEditable({
                    date_of_birth: false,
                    gender: false,
                    adharano: false,
                    bloodGroup: false,
                    emergencycontact: false,
                    pan: false,
                });
            } 
             else {
                console.error('Update failed:', responseData); // Log error response
                alert(`Failed to update employee details: ${responseData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating employee details:', error);
            alert('An error occurred while updating employee details.');
        }
    };

    return (
        <>
            <Header title="Update Employee Details" />
            <div className='form-container'>
                {employeeData ? (
                    <form onSubmit={handleSubmit}>
                        <div className='ovelimage' style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <label htmlFor="profile_image" style={{ cursor: 'pointer' }}>
                                {image || imageChanged ? (
                                    <img
                                        src={image || employeeData.profile_image}
                                        alt="Profile"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            borderRadius: '50%', // Oval shape
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            borderRadius: '50%',
                                            backgroundColor: '#EAEAEA',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#888',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Add Image
                                    </div>
                                )}
                            </label>
                            <input
                                type="file"
                                id="profile_image"
                                name="profile_image"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }} // Hide the file input
                            />
                        </div>


                        <div className="form-group1">
                            <label>First Name:</label>
                            <input
                                type="text"
                                name="FirstName"
                                value={employeeData.FirstName}
                                readOnly // Prevent editing the name
                            />
                        </div>
                        <div className="form-group2">
                            <label>MiddleName:</label>
                            <input
                                type="text"
                                name="MiddleName"
                                value={employeeData.MiddleName}
                                readOnly // Prevent editing the name
                            />
                        </div>
                        <div className="form-groups2">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="LastName"
                                value={employeeData.LastName}
                                readOnly // Prevent editing the name
                            />
                        </div>
                        {/* <div className="form-group3">
                            <label> Email:</label>
                            <input
                                type="email"
                                name="Email"
                                value={employeeData.email}
                                readOnly // Prevent editing the email
                            />
                        </div> */}
                        <div className="form-group4">
                            <label>Personal Email:</label>
                            <input
                                type="email"
                                name="personalEmail"
                                value={formData.personalEmail}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group5">
                            <label>Emp ID:</label>
                            <input
                                type="text"
                                name="EmpID"
                                value={formData.EmpID}
                                onChange={handleChange}
                                readOnly // Prevent editing EmpID if needed
                            />
                        </div>
                        <div className="form-group6">
                            <label>Department:</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group7">
                            <label>Assign Role:</label>
                            <input
                                type="text"
                                name="assignrole"
                                value={formData.assignrole}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        {/* Input fields for empty properties */}
                        <div className="form-group8">
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group9">
                            <label>Date of Birth:</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                disabled={!isEditable.date_of_birth}
                                style={{ backgroundColor: 'rgb(223, 237, 249)' }}
                            />
                        </div>
                        <div className="form-group10">
                            <label>Gender:</label>
                            <input
                                type="text"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={!isEditable.gender}
                                style={{ backgroundColor: 'rgb(223, 237, 249)' }}
                            />
                        </div>
                        <div className="form-group11">
                            <label>Emergency Contact:</label>
                            <input
                                type="text"
                                name="emergencycontact"
                                value={formData.emergencycontact}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group12">
                            <label>Blood Group:</label>
                            <input
                                type="text"
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                disabled={!isEditable.bloodGroup}
                                style={{ backgroundColor: 'rgb(223, 237, 249)' }}
                            />
                        </div>
                        <div className="form-group13">
                            <label>PAN:</label>
                            <input
                                type="text"
                                name="pan"
                                value={formData.pan}
                                onChange={handleChange}
                                disabled={!isEditable.pan}
                                style={{ backgroundColor: 'rgb(223, 237, 249)' }}
                            />
                        </div>
                        <div className="form-group14">
                            <label>State:</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group15">
                            <label>Marital Status:</label>
                            <input
                                type="text"
                                name="maritalstatus"
                                value={formData.maritalstatus}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group16">
                            <label>Aadhar Number:</label>
                            <input
                                type="text"
                                name="adharano"
                                value={formData.adharano}
                                onChange={handleChange}
                                disabled={!isEditable.adharano}
                                style={{ backgroundColor: 'rgb(223, 237, 249)' }}
                            />
                        </div>
                        
                        <div className="form-group18">
                            <label>Reporting Manager:</label>
                            <input
                                type="text"
                                name="reportingmanager"
                                value={formData.reportingmanager}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group19">
                            <label>Employment Type:</label>
                            <input
                                type="text"
                                name="employmenttype"
                                value={formData.employmenttype}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                       
                        <div className="form-group21">
                            <label>Job Description:</label>
                            <input
                                type="text"
                                name="jobdescription"
                                value={formData.jobdescription}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group23">
                            <label>Salary:</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group24">
                            <label>Benefits Information:</label>
                            <input
                                type="text"
                                name="benefitsinformation"
                                value={formData.benefitsinformation}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group25">
                            <label>Tax Information:</label>
                            <input
                                type="text"
                                name="taxinformation"
                                value={formData.taxinformation}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group26">
                            <label>Bank Account Number:</label>
                            <input
                                type="text"
                                name="bankaccountno"
                                value={formData.bankaccountno}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group27">
                            <label>IFSC Code:</label>
                            <input
                                type="text"
                                name="ifsccode"
                                value={formData.ifsccode}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group28">
                            <label>Branch Name:</label>
                            <input
                                type="text"
                                name="branchname"
                                value={formData.branchname}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>

                        <div className="form-group29">
                            <label>employmentStatus:</label>
                            <input
                                type="text"
                                name="employmentstatus"
                                value={formData.employmentstatus}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>

                        <div className="form-group30">
                            <label>contract StartDate:</label>
                            <input
                                type="date"
                                name="contractStartDate"
                                value={formData.contractStartDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group31">
                            <label>contract EndDate:</label>
                            <input
                                type="date"
                                name="contractEndDate"
                                value={formData.contractEndDate}
                                onChange={handleChange}
                            />
                        </div>



                        <div className='employment-info-box'>
                            <h3>Employment Information</h3>
                        </div>

                        <div className='Benefits'>
                            <h3>Compensation and Benefits</h3>

                        </div>

                        <div className='Certificates'>
                            <h2>Certificates </h2>

                        </div>
                        <div className="form-group33">
                            <label>SSLC Marks Card:</label>
                            <input
                                type="file"
                                name="sslcMarksCard"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    handleFileChange(e, 'sslcMarksCard');
                                }}
                            />
                        </div>

                        <div className="form-group34">
                            <label>PUC Marks Card:</label>
                            <input
                                type="file"
                                name="pucMarksCard"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    handleFileChange(e, 'pucMarksCard');
                                }}
                            />
                        </div>

                        <div>
                            <div className="form-group35">
                                <label style={{ marginRight: 'auto' }}>Degree Certificates:</label>
                                <span className="edit-icon" onClick={handleEditClick}>
                                    <FaEdit />
                                </span>
                                <input
                                    type="file"
                                    name="degreeCertificates"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                        handleFileChange(e, 'degreeCertificates');
                                    }}
                                />
                            </div>

                            {/* Modal */}
                            {isModalOpen && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <span className="close" onClick={handleCloseModal}>&times;</span>
                                        <h2>Update the Attached File</h2>
                                        <p>Saved File: {degreeCertificates || 'No file attached'}</p>
                                        {/* Optional: If you want to allow re-uploading the file */}
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, 'degreeCertificates')}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <button onClick={handleCloseModal}>Close</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="form-group36" >
                            <label>
                                Other Certificates:
                                <FaEdit
                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                    onClick={() => {
                                        // Handle edit icon click, if needed
                                    }}
                                />
                            </label>
                            <input
                                type="file"
                                name="otherCertificates"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    handleFileChange(e, 'otherCertificates');
                                }}
                            />
                        </div>
                        <div className="form-group37">
                            <label>Employment Contracts: </label>
                            <div className="toggle-switch">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="employmentContracts"
                                        checked={formData.employmentcontract}
                                        onChange={() =>
                                            setFormData({
                                                ...formData,
                                                employmentcontract: !formData.employmentcontract, // Toggle between true (Yes) and false (No)
                                            })
                                        }
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span>{formData.complianceTraining ? 'Yes' : 'No'}</span>
                            </div>
                        </div>

                        <div className="form-group38">
                            <label>Compliance Training:</label>
                            <div className="toggle-switch">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="complianceTraining"
                                        checked={formData.complianceTraining}
                                        onChange={() =>
                                            setFormData({
                                                ...formData,
                                                complianceTraining: !formData.complianceTraining, // Toggle between true (Yes) and false (No)
                                            })
                                        }
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span>{formData.complianceTraining ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className="updateEmployee">
                            <button type="submit">Update Employee</button>
                        </div>
                    </form>
                ) :
                    <></>
                }
            </div>
        </>
    );
};

export default UpdateEmployee;
