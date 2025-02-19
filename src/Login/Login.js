import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../EmployeeRecords/AuthContext/AuthContext'; // Ensure the path is correct


import backgroundimage from '../../src/Images/pexels-steve-29586677.jpg';
import './Login.css';

const HrmsLoginForm = () => {
    const [password, setPassword] = useState('');
    const [EmpID, setEmpID] = useState(''); // New state for EmpID
    const [isResetPassword, setIsResetPassword] = useState(false);
    const navigate = useNavigate();
    const { setEmpID: setUserEmpID, setRole } = useAuth(); // Destructure AuthContext setters

    // Log AuthContext for debugging
    console.log('Auth Context at Login Start:', useAuth());

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isResetPassword
                ? 'http://localhost:3002/reset-password'
                : 'http://localhost:3002/loginEmail';

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isResetPassword ? { EmpID } : { EmpID, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                alert('Login successful');

                // Store user data in localStorage
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        name: data.user.name,
                        role: data.user.assignrole,
                        empID: data.user.EmpID, // Correct key here
                    })
                );

                // Update AuthContext
                setUserEmpID(data.user.EmpID); // Update EmpID
                setRole(data.user.assignrole); // Update role

                console.log('Auth Context Updated:', {
                    EmpID: data.user.EmpID,
                    role: data.user.assignrole,
                });

                // Navigate to Homepage
                navigate('/Homepage');


            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed: ${error.message}`);
        }
    };


    return (
        <>

            <div className="login-container">
            </div>
            <form onSubmit={handleSubmit}>
                <p className='Hrmsparagraph'>{isResetPassword ? 'Reset Password' : 'Sign in'}</p>
                <label>
                    <input
                        type="text"
                        value={EmpID}
                        placeholder="EmployeeID"
                        onChange={(e) => setEmpID(e.target.value)}
                        required
                    />
                </label>
                {!isResetPassword && (
                    <label>
                        <input
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                )}
                <button className='submitbutton' type="submit">
                    {isResetPassword ? 'Send Reset Link' : 'Login'}
                </button>
                <a
                    href="#"
                    onClick={() => setIsResetPassword(!isResetPassword)}
                    className='resetpassword'
                >
                    {isResetPassword ? 'Back to Login' : 'Forgot Password?'}
                </a>
                
            </form>
           
        </>
    );
};

export default HrmsLoginForm;
