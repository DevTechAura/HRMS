// Import required modules
import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import multer from 'multer';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import crypto from 'crypto';


// Initialize Express app
const app = express();


// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use another email service provider
    auth: {
        user: 'deepthim9745@gmail.com', // Replace with your company email
        pass: 'sxqm ansl bcro mbdw'  // Replace with your company email password
    }
});


const router = express.Router();
// Database connection setup
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sunil@ipro#25",
    database: 'iproinfinityhrms'
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });


// User login endpoint
app.post('/loginEmail', (req, res) => {
    const { EmpID, password } = req.body;

    const query = 'SELECT * FROM employeerecord WHERE EmpID = ? AND password = ?';
    db.query(query, [EmpID, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database query error' });
        if (results.length > 0) {
            return res.status(200).json({
                success: true,
                user: {
                    name: `${results[0].FirstName} ${results[0].LastName}`,
                    EmpID: results[0].EmpID, // Ensure this is correct
                    assignrole: results[0].assignrole, // Ensure this is correct
                },
            });

        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    });
});



// Endpoint to retrieve an employee by login email
app.get('/api/employeerecord', (req, res) => {
    const EmpID = req.query.EmpID;
    let query = 'SELECT * FROM employeerecord'; // Default query

    if (EmpID) {
        query += ' WHERE EmpID = ?'; // Query by email if provided
    }

    db.query(query, [EmpID], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results); // Send back employee data as JSON
    });
});
app.get('/api/currentUserEmail', (req, res) => {
    // Replace this with your actual logic to get the user's email from the session or request
    const email = req.session.userEmail; // This assumes you have user session management in place

    if (!email) {
        return res.status(400).send('User email is required'); // Send plain text response
    }

    // Query to fetch the employee based on the email
    db.query('SELECT email FROM employeerecord WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal Server Error'); // Send plain text error response
        }

        if (results.length === 0) {
            return res.status(404).send('No employee record found'); // Send plain text message for no records
        }

        res.send(results[0].email); // Send the email directly
    });
});



app.post("/add-employee", (req, res) => {
    const {
        FirstName,
        MiddleName,
        LastName,
        personalEmail,
        mobileNumber,
        password,
        EmpID,
        department,
        assignrole,
        Familycontact,
        permantaddress,
        Familyemail,
        address,
        reportingmanager,
        jobtitle,
        noticeperiod,
        employmenttype,
        fullTime,
        partTime,
        partTimeFrom,
        partTimeTo,
        contract,
        contractStartDate,
        contractEndDate,
        country,
        pincode,
        city,
        jobdescription,
        state,
    } = req.body;

    const sql = `
        INSERT INTO employeerecord 
        (FirstName, MiddleName, LastName, personalEmail, mobileNumber, password, EmpID, department,
         assignrole, Familycontact, permantaddress, Familyemail, address, reportingmanager,
         jobtitle, noticeperiod, employmenttype, fullTime, partTime, partTimeFrom, 
         partTimeTo, contract, contractStartDate, contractEndDate, country, pincode, city,jobdescription, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        FirstName,
        MiddleName,
        LastName,
        personalEmail,
        mobileNumber,
        password,
        EmpID,
        department,
        assignrole,
        Familycontact,
        permantaddress,
        Familyemail,
        address,
        reportingmanager,
        jobtitle,
        noticeperiod,
        employmenttype,
        fullTime,
        partTime,
        partTimeFrom,
        partTimeTo,
        contract,
        contractStartDate,
        contractEndDate,
        country,
        pincode,
        city,
        jobdescription,
        state,
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding employee:", err);
            return res.status(500).send({ success: false, message: "Error adding employee" });
        }

        // Send email notification
        const mailOptions = {
            from: 'deepthim9745@gmail.com',
            to: personalEmail, // Send email to the user's personal email
            subject: 'Employee Registration Confirmation',
            text: `Dear ${FirstName},
      
Your data has been successfully added to the Employee database.

Your company email is: ${EmpID}
Your password is: ${password}

Thank you,
Iproinfinity Support Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send({ success: false, message: 'Error sending email' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.send({ success: true, message: 'Employee added and email sent successfully!' });
            }
        });
    });
});

app.put("/edit-employee/:EmpID", (req, res) => {
    const EmpID = req.params.EmpID;
    const {
        FirstName,
        MiddleName,
        LastName,
        personalEmail,
        mobileNumber,
        password,
        department,
        assignrole,
        Familycontact,
        permantaddress,
        Familyemail,
        address,
        reportingmanager,
        jobtitle,
        noticeperiod,
        employmenttype,
        fullTime,
        partTime,
        partTimeFrom,
        partTimeTo,
        contract,
        contractStartDate,
        contractEndDate,
        country,
        pincode,
        city,
         // Ensure "state" is passed in the request body
    } = req.body;

    const sql = `
        UPDATE employeerecord
        SET 
            FirstName = ?, 
            MiddleName = ?, 
            LastName = ?, 
            personalEmail = ?, 
            mobileNumber = ?, 
            password = ?, 
            department = ?, 
            assignrole = ?, 
            Familycontact = ?, 
            permantaddress = ?, 
            Familyemail = ?, 
            address = ?, 
            reportingmanager = ?, 
            jobtitle = ?, 
            noticeperiod = ?, 
            employmenttype = ?, 
            fullTime = ?, 
            partTime = ?, 
            partTimeFrom = ?, 
            partTimeTo = ?, 
            contract = ?, 
            contractStartDate = ?, 
            contractEndDate = ?, 
            country = ?, 
            pincode = ?, 
            city = ? 
           
        WHERE EmpID = ?
    `;

    const values = [
        FirstName,
        MiddleName,
        LastName,
        personalEmail,
        mobileNumber,
        password,
        department,
        assignrole,
        Familycontact,
        permantaddress,
        Familyemail,
        address,
        reportingmanager,
        jobtitle,
        noticeperiod,
        employmenttype,
        fullTime,
        partTime,
        partTimeFrom,
        partTimeTo,
        contract,
        contractStartDate,
        contractEndDate,
        country,
        pincode,
        city,
       
        EmpID,
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating employee:", err);
            return res.status(500).send({
                success: false,
                message: "Failed to update employee. Please try again.",
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: "Employee not found" });
        }

        res.send({ success: true, message: "Employee updated successfully" });
    });
});

// Fetch employee records
app.get('/employeerecord', (req, res) => {
    const query = 'SELECT * FROM EmployeeRecord'; // Modify this query if you want to fetch specific fields

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employee records:', err);
            return res.status(500).json({ success: false, message: 'Error fetching records' });
        }

        // If successful, send the data back
        res.json({ success: true, data: results });
    });
});

app.get('/employeerecord/:EmpID', async (req, res) => {
    const EmpID = req.params.EmpID;

    try {
        const [employee] = await db.query('SELECT * FROM employeerecord WHERE EmpID = ?', [EmpID]);
        if (employee.length > 0) {
            res.json({ success: true, data: employee[0] }); // Return the employee data
        } else {
            res.status(404).json({ success: false, message: 'No employee found with that ID.' });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/getEmployeeData', async (req, res) => {
    const { email } = req.EmpID;
    const query = 'SELECT * FROM EmployeeRecord  WHERE email = ?'; // Assuming the table name is employeerecord
    db.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database query failed' });
        }
        if (result.length > 0) {
            return res.status(200).json({ success: true, data: result[0] });
        } else {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
    });
});

app.put('/api/employeerecord/:EmpID', async (req, res) => {
    const { EmpID } = req.params;
    const updatedData = req.body;

    try {
        // Ensure you have a valid connection to the database
        const result = await db.query('UPDATE employeerecord SET ? WHERE EmpID = ?', [updatedData, EmpID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({ message: 'Employee details updated successfully.' });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.put('/api/employeerecord/:EmpID', (req, res) => {
    const EmpID = req.params.EmpID;
    const { name, email, degreeCertificates } = req.body; // Extract fields from the request body

    // Construct the SQL query
    let query = 'UPDATE employeerecord SET ';
    const updates = [];
    if (name) updates.push(`name = '${name}'`);
    if (email) updates.push(`email = '${email}'`);
    if (degreeCertificates) updates.push(`degreeCertificates = '${degreeCertificates}'`);

    // Ensure there are updates to apply
    if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update.' });
    }

    query += updates.join(', ') + ` WHERE EmpID = '${EmpID}'`;

    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            console.error('SQL error:', error);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        return res.json({ message: 'Employee details updated successfully.' });
    });
});
app.delete('/api/delete-employee/:EmpID', (req, res) => {
    const EmpID = parseInt(req.params.EmpID, 10);  // Convert to integer if necessary

    const sql = 'DELETE FROM employeerecord WHERE EmpID = ?';
    db.query(sql, [EmpID], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ success: false, message: 'Error executing query' });
        }

        if (result.affectedRows === 0) {
            console.log('No employee found with EmpID:', EmpID);
            return res.status(404).send({ success: false, message: 'Employee not found' });
        }

        console.log('Employee deleted successfully, result:', result);
        return res.send({ success: true, message: 'Employee deleted successfully' });
    });
});


app.post('/uploadFile', upload.single('degreeCertificate'), (req, res) => {
    const filePath = `/uploads/${req.file.filename}`; // Save the file path
    const employeeId = req.body.employeeId;

    const sql = `UPDATE employeerecords SET degreeCertificates = ? WHERE id = ?`;
    db.query(sql, [filePath, employeeId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error storing file path' });
        }
        res.json({ success: true, message: 'File uploaded successfully' });
    });
});
// Toggle employee status (PATCH request)
app.patch('/toggle-employee-status/:EmpID', (req, res) => {
    const EmpID = req.params.EmpID;

    // First, get the current employment status of the employee
    const getStatusQuery = 'SELECT employmentstatus FROM EmployeeRecord WHERE EmpID = ?';
    db.query(getStatusQuery, [EmpID], (err, results) => {
        if (err) {
            console.error('Error fetching employee status:', err);
            return res.status(500).json({ success: false, message: 'Error fetching employee status' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // Toggle the employment status: if Active, set to Deactive; if Deactive, set to Active
        const currentStatus = results[0].employmentstatus;
        const newStatus = currentStatus === 'Active' ? 'Deactive' : 'Active';

        // Update the employment status in the database
        const updateStatusQuery = 'UPDATE EmployeeRecord SET employmentstatus = ? WHERE EmpID = ?';
        db.query(updateStatusQuery, [newStatus, EmpID], (err, result) => {
            if (err) {
                console.error('Error updating employee status:', err);
                return res.status(500).json({ success: false, message: 'Error updating employee status' });
            }

            return res.json({ success: true, message: 'Employee status updated successfully', newStatus });
        });


    });
});

function generateResetToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Function to send the reset email
function sendResetEmail(email, token) {
    const mailOptions = {
        from: 'deepthim9745@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Please use the following link to reset your password: 
        http://localhost:3002/reset-password?token=${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return false; // Return false if the email fails to send
        } else {
            console.log('Email sent:', info.response);
            return true; // Return true if the email is sent successfully
        }
    });
}


// Reset password endpoint
app.post('/reset-password', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    const resetToken = generateResetToken();
    const query = 'UPDATE email SET resetToken = ?, updated_at = NOW() WHERE email = ?';

    db.query(query, [resetToken, email], (err, results) => {
        if (err) {
            console.error("Error executing query: " + err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
        if (results.affectedRows > 0) {
            sendResetEmail(email, resetToken);
            res.json({ success: true, message: "Reset password email sent" });
        } else {
            res.status(404).json({ success: false, message: "Email not found" });
        }
    });
});

app.post('/update-password', (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    const query = 'UPDATE email SET password = ?, resetToken = NULL WHERE resetToken = ?';

    db.query(query, [newPassword, token], (err, results) => {
        if (err) {
            console.error("Error updating password: " + err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (results.affectedRows > 0) {
            res.json({ success: true, message: "Password reset successfully" });
        } else {
            res.status(404).json({ success: false, message: "Invalid or expired token" });
        }
    });
});


app.get('/get-employee/:EmpID', (req, res) => {
    const empId = req.params.EmpID;
    const query = 'SELECT * FROM EmployeeRecord WHERE EmpID = ?';

    db.query(query, [empId], (err, result) => {
        if (err) {
            console.error('Error fetching employee data:', err);
            return res.status(500).json({ success: false, message: 'Error fetching employee data' });
        }

        if (result.length > 0) {
            return res.json({ success: true, employee: result[0] }); // Send employee data
        } else {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
    });
});

// Upload profile image endpoint
app.post('/upload-profile-image', upload.single('profileImage'), (req, res) => {
    const FirstName = req.body.FirstName;
    const image = req.file;

    if (!image) {
        return res.status(400).json({ message: 'No file received.' });
    }

    const query = 'UPDATE employeerecord SET profile_image = ? WHERE FirstName = ?';
    db.query(query, [image.buffer, FirstName], (err, results) => {
        if (err) {
            console.error('Error updating profile image:', err);
            return res.status(500).json({ message: 'Error updating profile image.' });
        }
        res.json({ message: 'Profile image updated successfully.' });
    });
});

// Logout endpoint that clears profile image
app.post('/logout', (req, res) => {
    const { FirstName } = req.body;

    const query = 'UPDATE employeerecord SET profile_image = NULL WHERE FirstName = ?';
    db.query(query, [FirstName], (err, result) => {
        if (err) {
            console.error('Error clearing profile image:', err);
            return res.status(500).send('Error clearing profile image');
        }
        res.status(200).send('Logged out successfully');
    });
});

app.get('/api/employeerecord/:EmpID/degreeCertificates', (req, res) => {
    const EmpID = req.params.EmpID;

    // Query to fetch the degree certificate (assuming it's stored as a BLOB)
    const query = 'SELECT degreeCertificates FROM employeerecord WHERE EmpID = ?';
    db.query(query, [EmpID], (err, result) => {
        if (err) {
            console.error('Error fetching the document:', err);
            res.status(500).send('Error fetching the document.');
            return;
        }

        if (result.length === 0 || !result[0].degreeCertificates) {
            res.status(404).send('Document not found.');
            return;
        }

        const document = result[0].degreeCertificates;

        // Set headers to inform the browser it's a PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=degreeCertificate.pdf');

        // Send the binary data as the response
        res.send(document);
    });
});

app.post('/api/applyLeave', async (req, res) => {
    const { email, LeaveType, StartDate, EndDate, reason } = req.body;

    try {
        // Insert leave application details into the database
        const query = 'INSERT INTO leavemanagement (email, LeaveType, StartDate, EndDate, reason) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [email, LeaveType, StartDate, EndDate, reason]);

        res.status(200).json({ message: 'Leave applied successfully' });
    } catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ message: 'Failed to apply leave' });
    }
});

// app.get('/api/leave_balance', (req, res) => {
//     const query = 'SELECT * FROM leave_balance';
//     db.query(query, (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(results);
//     });
// });

// app.get('/api/leave_balance', (req, res) => {
//     const email = req.query.email;

//     // Check if email is provided
//     if (!email) {
//         return res.status(400).json({ message: 'Email is required' });
//     }

//     console.log('Received email query parameter:', email); // Debugging

//     // Query the database for leave data based on the email
//     db.query('SELECT * FROM leave_balance WHERE email = ?', [email], (err, result) => {
//         if (err) {
//             console.error(err); // Log the error for debugging
//             return res.status(500).json({ message: err.message });
//         }

//         console.log('Query result:', result); // Debugging the result
//         res.json(result); // Send the result back to the client
//     });
// });


app.get('/api/login', (req, res) => {
    const query = 'SELECT * FROM login';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.get('/api/leaverequest', (req, res) => {
    const query = 'SELECT * FROM leaverequest';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.get('/api/leave_balance', (req, res) => {
    const query = 'SELECT * FROM leave_balance';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});



app.post('/api/leave_balance', async (req, res) => {
    const { EmpID, LeaveType, AssignedLeave, AvailedLeave } = req.body;

    try {
        // Insert leave application details into the database
        const query = 'INSERT INTO leave_balance (EmpID  , LeaveType, AssignedLeave, AvailedLeave) VALUES ( ?, ?, ?, ?)';
        await db.query(query, [EmpID, LeaveType, AssignedLeave, AvailedLeave]);

        res.status(200).json({ message: 'Leave applied successfully' });
    } catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ message: 'Failed to apply leave' });
    }
});

app.get('/leave_balance', async (req, res) => {
    const { EmpID } = req.query;

    try {
        const [result] = await db.query('SELECT leave_balance FROM Leave_balance WHERE email = ?', [EmpID]);

        if (result.length > 0) {
            res.json({ success: true, leaveBalance: result[0].leave_balance });
        } else {
            res.json({ success: false, message: 'Leave balance not found' });
        }
    } catch (error) {
        console.error('Error fetching leave balance:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Assuming an Express setup for your backend
app.get('/api/getAssignedLeave', async (req, res) => {
    const { email } = req.query;

    try {
        const [rows] = await db.query(
            'SELECT * FROM leavebalance WHERE email = ?',
            [email]
        );

        if (rows.length) {
            res.json(rows);
        } else {
            res.status(404).json({ message: 'No leave records found for this email' });
        }
    } catch (error) {
        console.error('Error fetching leave data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/api/leaverequest', (req, res) => {
    const { EmpID, totalnoofdays, Leavetype, startdate, enddate, leavebalanceid, reason, status } = req.body;

    console.log("Request Data:", req.body);  // Log the received request body

    if (!EmpID || !totalnoofdays || !Leavetype || !startdate || !enddate || !leavebalanceid || !reason || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
        INSERT INTO leaverequest (EmpID, totalnoofdays , Leavetype, startdate, enddate,leavebalanceid, reason, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [EmpID, totalnoofdays, Leavetype, startdate, enddate, leavebalanceid, reason, status];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error submitting leave request:', err);  // Log the error details
            return res.status(500).json({ message: 'Error submitting leave request', error: err.message });
        }
        res.status(200).json({ message: 'Leave request submitted successfully', data: result });
    });
});




//


app.get('/api/leave_balance', async (req, res) => {
    const { EmpID } = req.query;
    try {
        const [rows] = await db.query('SELECT * FROM leave_balance WHERE email = ?', [EmpID]);
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'Leave balance not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching leave balance.' });
    }
});

// PATCH route to update leave balance
app.patch('/api/leave_balance/:id', async (req, res) => {
    const { AssignedLeave, AvailedLeave, PendingLeave } = req.body;
    const leavebalanceid = req.params.id;

    try {
        const query = `
            UPDATE leave_balance
            SET AssignedLeave = ?, AvailedLeave = ?, PendingLeave = ?
            WHERE leavebalanceid = ?
        `;
        const result = await db.query(query, [AssignedLeave, AvailedLeave, PendingLeave, leavebalanceid]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Leave balance record not found');
        }

        res.status(200).send('Leave balance updated successfully');
    } catch (error) {
        console.error('Error updating leave balance:', error);
        res.status(500).send('Internal server error');
    }
});

// app.post('/api/leaverequest', async (req, res) => {
//     console.log('Received leave request data:', req.body);

//     const { empid, email, Leavetype, startdate, enddate, reason, status, leavebalanceid, totalnoofdays } = req.body;

//     // Check if the data is correct
//     console.log("empid:", empid);
//     console.log("leavebalanceid:", leavebalanceid);

//     try {
//         // Insert the leave request into the database
//         const result = await db.query(`
//             INSERT INTO leaverequest (empid, email, Leavetype, startdate, enddate, reason, status, leavebalanceid, totalnoofdays)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [empid, email, Leavetype, startdate, enddate, reason, status, leavebalanceid, totalnoofdays]
//         );

//         res.status(200).json({ message: 'Leave request submitted successfully' });
//     } catch (error) {
//         console.error('Error inserting leave request:', error);
//         res.status(500).json({ message: 'Error submitting leave request' });
//     }
// });



const transporters = nodemailer.createTransport({
    service: 'gmail', // You can use another email service provider
    auth: {
        user: 'deepthim9745@gmail.com', // Replace with your company email
        pass: 'sxqm ansl bcro mbdw'  // Replace with your company email password
    }
});

const sendEmail = (to, subject, text, html) => {
    // Configure the transporter (assuming SMTP for Gmail here)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'deepthim9745@gmail.com', // your email
            pass: 'sxqm ansl bcro mbdw'  // your email password
        }
    });

    const mailOptions = {
        from: 'deepthi@iproinfinity.com', // your email
        to: to,  // dynamic recipient
        subject: subject,
        text: text,
        html: html,  // using HTML content with the buttons
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

app.post('/api/sendLeaveRequestEmail', (req, res) => {
    const { EmpID, leaveType, startDate, endDate, reason, totalnoofdays, leaveRequestID } = req.body;
    const emailSubject = `Leave Request from Employee ID: ${EmpID}`;

    // Query to get the employee's first name from the employeerecord table
    const employeeQuery = `SELECT FirstName FROM employeerecord WHERE EmpID = ?`;

    db.query(employeeQuery, [EmpID], (err, results) => {
        if (err) {
            console.error('Error fetching employee details:', err);
            return res.status(500).json({ message: 'Error fetching employee details', error: err.message });
        }

        // Check if the employee was found
        if (results.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const { FirstName } = results[0]; // Extract the first name from the query result

        // Compose email content
        const emailText = `Hello Manager,

Employee ${FirstName} (ID: ${EmpID}) has submitted a leave request with the following details:

Leave Type: ${leaveType}
Start Date: ${startDate}
End Date: ${endDate}
Total No of Days: ${totalnoofdays}
Reason: ${reason}

Please review and approve/reject the request.

Approve: http://yourdomain.com/api/approveLeaveRequest/${EmpID}
Reject: http://yourdomain.com/api/rejectLeaveRequest/${leaveRequestID}

Regards,
Your Company`;

        const emailHtml = `
<html>
    <body>
        <p>Hello Manager,</p>
        <p>Employee <strong>${FirstName}</strong> (ID: ${EmpID}) has submitted a leave request with the following details:</p>
        <ul>
            <li><strong>Leave Type:</strong> ${leaveType}</li>
            <li><strong>Start Date:</strong> ${startDate}</li>
            <li><strong>End Date:</strong> ${endDate}</li>
            <li><strong>Total No of Days:</strong> ${totalnoofdays}</li>
            <li><strong>Reason:</strong> ${reason}</li>
        </ul>
        <p>Please review and approve/reject the request:</p>

        <p>
            <!-- Approve Link -->
            <a href="https://yourdomain.com/api/approveLeaveRequest/${leaveRequestID}" 
               style="background-color: green; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Approve
            </a>
            &nbsp;&nbsp;
            <!-- Reject Link -->
            <a href="https://yourdomain.com/api/rejectLeaveRequest/${leaveRequestID}" 
               style="background-color: red; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Reject
            </a>
        </p>

        <p>Regards,</p>
        <p>Your Company</p>
    </body>
</html>
`;



        // Send email using your transporter (e.g., nodemailer)
        transporter.sendMail({
            from: 'deepthi@iproinfinity.com',
            to: 'deepthim9745@gmail.com',
            subject: emailSubject,
            text: emailText,
            html: emailHtml
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email', error: error.message });
            }
            res.status(200).json({ message: 'Leave request email sent successfully', info });
        });
    });
});


app.get('/api/approveLeaveRequest/:leaveRequestID', (req, res) => {
    const { leaveRequestID } = req.params;

    // Query to update the status of the leave request to 'approved'
    const updateStatusQuery = `UPDATE leaverequest SET status = 'approved' WHERE leaveRequestID = ?`;

    db.query(updateStatusQuery, [leaveRequestID], (err, result) => {
        if (err) {
            console.error('Error updating leave request status:', err);
            return res.status(500).json({ message: 'Error updating leave request status' });
        }

        // Send a simple response without redirecting
        res.send('<p>Leave request status has been updated to approved.</p>');
    });
});



app.get('/api/rejectLeaveRequest/:leaveRequestID', (req, res) => {
    const { leaveRequestID } = req.params;

    // Query to update the status of the leave request to 'rejected'
    const updateStatusQuery = `UPDATE leaverequest SET status = 'rejected' WHERE leaveRequestID = ?`;

    db.query(updateStatusQuery, [leaveRequestID], (err, result) => {
        if (err) {
            console.error('Error updating leave request status:', err);
            return res.status(500).json({ message: 'Error updating leave request status' });
        }

        // Send a simple response without redirecting
        res.send('<p>Leave request status has been updated to rejected.</p>');
    });
});


app.post('/employeerecord', (req, res) => {
    const { email } = req.body;

    const query = 'SELECT * FROM employeerecord WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching employee data');
        }
        res.json(results);
    });
});

app.post('/updateLeaveRequest', (req, res) => {
    const {
        leaverequestid, empid, email, Leavetype, startdate,
        enddate, reason, status, leavebalanceid, totalnoofdays
    } = req.body;

    // Log to debug missing fields
    console.log("Request Data:", req.body);

    let fieldsToUpdate = {
        empid,
        email,
        Leavetype,
        startdate,
        enddate,
        reason,
        status,
        leavebalanceid,  // Ensure this is not `null`
        totalnoofdays
    };


    app.patch('/api/leave_balance/:leavebalanceid', (req, res) => {
        const { leavebalanceid } = req.params;
        const { AssignedLeave, AvailedLeave, PendingLeave } = req.body;

        // Check if leavebalanceid is valid
        if (!leavebalanceid) {
            return res.status(400).json({ error: 'Leave balance ID is required' });
        }

        // Update the leave balance in the database
        const query = `
        UPDATE leave_balance
        SET AssignedLeave = ?, AvailedLeave = ?, PendingLeave = ?
        WHERE leavebalanceid = ?
    `;

        db.query(query, [AssignedLeave, AvailedLeave, PendingLeave, leavebalanceid], (err, result) => {
            if (err) {
                console.error('Error updating leave balance:', err);
                return res.status(500).json({ error: 'Failed to update leave balance' });
            }

            res.status(200).json({ message: 'Leave balance updated successfully' });
        });
    });


    // Filter out fields that are null or undefined
    let updateFields = [];
    let values = [];
    for (const field in fieldsToUpdate) {
        if (fieldsToUpdate[field] !== null && fieldsToUpdate[field] !== undefined) {
            updateFields.push(`${field} = ?`);
            values.push(fieldsToUpdate[field]);
        }
    }

    // Ensure that leaverequestid is always part of the query (as the condition)
    values.push(leaverequestid);

    // Build the SQL query dynamically based on available fields
    const query = `
        UPDATE leave_requests
        SET 
            ${updateFields.join(', ')}
        WHERE leaverequestid = ?;
    `;

    // Execute the query
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating leave request:', err);
            return res.status(500).send('Error updating leave request');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Leave request not found');
        }

        res.status(200).send('Leave request updated successfully');
    });
});

app.post('/api/leaverequest', (req, res) => {
    const { leaverequestid, action } = req.body;

    // Log the received data
    console.log('Received Data:', { leaverequestid, action });

    // Validate the required fields
    if (!leaverequestid || !action) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Determine the status based on the action (approve/reject)
    const status = action === 'approve' ? 'Approved' : 'Rejected';

    // Update the leave request status in the database
    const query = 'UPDATE leaverequest SET status = ? WHERE leaverequestid = ?';
    db.query(query, [status, leaverequestid], (err, result) => {
        if (err) {
            console.error('Error updating leave request status:', err.stack);
            return res.status(500).json({ message: 'Error updating status' });
        }

        // Send success response
        res.json({ success: true });
    });
});




// API to approve or reject a leave request
app.patch('/api/leaverequest/:leaverequestid', (req, res) => {
    const { status, comments } = req.body; // Extract both status and comments from the request body
    const { leaverequestid } = req.params; // Get the leave request ID from the URL parameter

    // Ensure at least one field (status or comments) is provided
    if (!status && !comments) {
        return res.status(400).json({ message: 'Status or comment must be provided' });
    }

    // Construct the SQL query with conditional updates based on provided data
    let updateQuery = 'UPDATE leaverequest SET ';
    let queryParams = [];

    if (status) {
        updateQuery += 'status = ?';
        queryParams.push(status);
    }

    if (comments) {
        if (status) {
            updateQuery += ', '; // Add a comma if both fields are being updated
        }
        updateQuery += 'comments = ?';
        queryParams.push(comments);
    }

    updateQuery += ' WHERE leaverequestid = ?';
    queryParams.push(leaverequestid);

    // Execute the query
    db.query(updateQuery, queryParams, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error updating leave request' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json({ message: `Leave request updated successfully` });
    });
});

const sendapproverejectEmail = async (email, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'deepthim9745@gmail.com',
            pass: 'sxqm ansl bcro mbdw' // Ensure this is an app-specific password
        },
    });

    let mailOptions = {
        from: 'deepthim9745@gmail.com',
        to: email,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Endpoint to handle email sending
app.post('/sendEmail', async (req, res) => {
    const { email, status } = req.body;

    const subject = 'Leave Request Status Update';
    const text = `Dear Employee,\n\nYour leave request has been ${status}.\n\nRegards,\nYour HR Team`;

    try {
        await sendapproverejectEmail(email, subject, text);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send email');
    }
});

app.get('/api/leaverequest', (req, res) => {
    const { EmpID } = req.query; // Get the email from query parameters
    console.log('Email received from frontend:', EmpID); // Debugging line

    if (!EmpID) {
        return res.status(400).json({ error: 'EmpID is required' });
    }

    // Query to fetch leave requests for the specific email
    const query = 'SELECT * FROM leaverequest WHERE EmpID = ?';
    db.query(query, [EmpID], (err, results) => {
        if (err) {
            console.error('Error fetching leave requests:', err);
            return res.status(500).json({ error: 'Error fetching data' });
        }
        res.json(results); // Send filtered results
    });
});

app.post('/api/leave_balance', (req, res) => {
    const { EmpID, name, email, Leavetype, AssignedLeave, AvailedLeave, CarryforwardBalance, PendingLeave, assignrole } = req.body;

    // Log the received data (for debugging)
    console.log('Received data:', req.body);

    // SQL query to insert data into the database
    const query = `
    INSERT INTO leave_balance (EmpID, name, email, Leavetype, AssignedLeave, AvailedLeave, CarryforwardBalance, PendingLeave, assignrole)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(query, [EmpID, name, email, Leavetype, AssignedLeave, AvailedLeave, CarryforwardBalance, PendingLeave, assignrole], (err, result) => {
        if (err) {
            console.error('Error saving leave balance:', err);
            return res.status(500).json({ message: 'Failed to add leave balance' });
        }
        res.status(200).json({ message: 'Leave balance added successfully' });
    });
});


app.post("/api/leave_balance", (req, res) => {
    const {
        EmpID,
        name = "Unknown",
        email = "unknown@example.com",
        Leavetype = "General",
        AssignedLeave = 0,
        AvailedLeave = 0,
        CarryforwardBalance = 0,
        pendingLeave = AssignedLeave - AvailedLeave,
        assignrole = "Employee",
    } = req.body;

    const query = `
        INSERT INTO leave_balance 
        (EmpID, name, email, Leavetype, AssignedLeave, AvailedLeave, CarryforwardBalance, pendingLeave, assignrole) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [EmpID, name, email, Leavetype, AssignedLeave, AvailedLeave, CarryforwardBalance, pendingLeave, assignrole],
        (err, result) => {
            if (err) {
                console.error("Error inserting record:", err);
                res.status(500).send("Failed to add record.");
                return;
            }
            res.status(200).send("Record added successfully.");
        }
    );
});

app.get('/api/holidays', (req, res) => {
    const query = 'SELECT * FROM CompanyHolidays';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching holidays:', error);
            res.status(500).send('Server Error');
        } else {
            res.json(results);
        }
    });
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
