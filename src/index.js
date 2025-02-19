import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './EmployeeRecords/AuthContext/AuthContext';
import App from './App';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
