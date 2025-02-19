import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profilepopup.css';
import { FaSignOutAlt } from 'react-icons/fa';

const ProfilePopup = ({ onClose, userName, onProfileImageUpdate, setUserName, setIsLoggedIn }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Fetch the user's profile image
    const fetchProfileImage = async (FirstName) => {
        try {
            const response = await fetch(`http://localhost:3002/profile-image/${FirstName}`);
            if (!response.ok) {
                console.error('Network response was not ok:', response.statusText);
                return;
            }

            const data = await response.json();
            console.log('Fetched data:', data); // Log the fetched data
            if (data.profile_image) {
                console.log('Profile image found:', data.profile_image); // Check the profile_image
                setProfileImage(`data:image/jpeg;base64,${data.profile_image}`);
            } else {
                console.error('Image not found or empty:', data);
                setProfileImage(null);
            }
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    };

    useEffect(() => {
        console.log(`User name in useEffect: ${userName}`); // Log the user name
        if (userName) {
            fetchProfileImage(userName); // Call when userName changes
        } else {
            console.warn('No user name available'); // Warn if userName is empty
        }
    }, [userName]);

    useEffect(() => {
        console.log('Profile image state changed:', profileImage); // Log whenever profileImage changes
    }, [profileImage]);

    // Handle changes to the file input
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setProfileImage(URL.createObjectURL(file)); // Update local state with the new image
        }
    };

    // Save the new profile image
    const handleSave = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('profileImage', selectedFile);
            formData.append('FirstName', userName); // Include user name

            try {
                await axios.post('http://localhost:3002/upload-profile-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setSuccessMessage('Updated successfully!');
                setErrorMessage('');
                const newImageUrl = URL.createObjectURL(selectedFile);
                setProfileImage(newImageUrl); // Update local state
                onProfileImageUpdate(newImageUrl); // Update profile image in the Header

                // Save the new image URL to localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.profileImage = newImageUrl; // Add profileImage to user object
                    localStorage.setItem('user', JSON.stringify(user)); // Update localStorage
                }

                setTimeout(() => onClose(), 2000); // Close popup after 2 seconds
            } catch (error) {
                setErrorMessage('Failed to save profile image.');
                setSuccessMessage('');
                console.error('Failed to save profile image:', error);
            }
        } else {
            setErrorMessage('No file selected!');
        }
    };

    // Handle user sign-out
    const handleSignOut = async () => {
        try {
            const response = await axios.post('http://localhost:3002/logout', { userName });
            if (response.status === 200) {
                localStorage.removeItem('user');  // Clear user data from localStorage
                setUserName('');  // Clear the userName in Header
                setIsLoggedIn(false);  // Set login state to false in Header
                navigate('/');  // Redirect the user to the login page or home page
                window.location.reload();  // Reload the page to update the header
            } else {
                console.error('Failed to logout:', response.data);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Trigger the file input click
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="profile-popup">
            <i className="fas fa-times close-icon" onClick={onClose} title="Close"></i>
            <div className="profile-content1">
                <div className="profile-image-container1">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="profile-image1" />
                    ) : (
                        <span>No Image Available</span>
                    )}
                </div>
                <div className="profile-details">
                    <h2 className="h2">{userName || 'User Name'}</h2>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="file"
                        ref={fileInputRef} // Add ref to file input
                        style={{ display: 'none' }} // Hide the default file input
                    />
                    <button
                        onClick={triggerFileInput}
                        className="edit-button"
                        title="Edit"
                    >
                        Edit
                    </button>
                    <i
                        className="fas fa-save save-icon"
                        onClick={handleSave}
                        title="Save"
                    ></i>
                    <div className="horizontal-container">
                        <hr />
                    </div>
                    <div className="signout-container">
                        <FaSignOutAlt className="signout-icon" />
                        <p className="signout-link" onClick={handleSignOut}>Sign Out</p>
                    </div>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;
