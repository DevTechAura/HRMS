import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [EmpID, setEmpID] = useState(null); // Ensure this is correctly initialized

    return (
        <AuthContext.Provider value={{ role, EmpID, setRole, setEmpID }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
