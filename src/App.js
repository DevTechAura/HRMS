import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../src/EmployeeRecords/AuthContext/AuthContext'; // Ensure the path is correct
import Homepage from './Homepage/Homepage';
import LoginForm from '../src/Login/Login';
import AddEmployee from './EmployeeRecords/AddEmployeedata/AddEmployee';
import EmployeeDataView from '../src/EmployeeRecords/EmployeeViewData/EmployeeViewData.js';
import LMShomepage from '../src/LeaveManagementSystem/LMSHomepage/LMShomepage';
import ApplyLeave from '../src/LeaveManagementSystem/ApplyLeaveScreen/ApplyLeave.js';
import CompanyHolidays from './LeaveManagementSystem/CompanyHolidays/CompanyHolidays.js';
import LeaveApprover from './LeaveManagementSystem/LeaveApprover/LeaveApprover.js';
import LeaveBalance from './LeaveManagementSystem/Leavebalance/LeaveBalance.js';
import LeaveSubmittedScreen from './LeaveManagementSystem/LeaveSubmittedScreen/LeaveSubmittedScreen.js';
import AddLeaveBalance from './LeaveManagementSystem/AddLeavebalance/AddLeavebalance.js';
const App = () => {
  return (
    <AuthProvider> {/* Wrap your routes with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/EmployeeDataview" element={<EmployeeDataView />} />
          <Route path="/updateemployee" element={<AddEmployee />} />
          <Route path="/LMShomepage" element={<LMShomepage />} />
          <Route path="/ApplyleaveScreen" element= {<ApplyLeave/>} />
          <Route path="/companyholidays" element={<CompanyHolidays />} />
          <Route path="/approveleave" element={<LeaveApprover />} />
          <Route path="/Leavebalance" element={<LeaveBalance />} />
          <Route path="/LeaveSubmitted" element={<LeaveSubmittedScreen />} />
          <Route path="/AddLeaveBalance" element={<AddLeaveBalance />} />
          
  

          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
