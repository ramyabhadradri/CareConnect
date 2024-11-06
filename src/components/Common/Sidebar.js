// src/components/Common/Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './comStyle.css'; // Import the CSS file

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
       
        <Nav.Link as={Link} className='mt-2'>Home</Nav.Link>
        {/* Render links based on role */}
        {role === 'admin' && (
          <>
            <Nav.Link as={Link} to="/manage-notifications">Manage Notifications</Nav.Link>
            <Nav.Link as={Link} to="/manage-users">Manage Users</Nav.Link>
            <Nav.Link as={Link} to="/remind-users">Remind users</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/help">Help Guide</Nav.Link>
          </>
        )}
        {role === 'doctor' && (
          <>
            <Nav.Link as={Link} to="/appointments">Check Appointments</Nav.Link>
            <Nav.Link as={Link} to="/patient-records">Check Patient Records</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/help">Help Guide</Nav.Link>
          </>
        )}
        {role === 'patient' && (
          <>
            <Nav.Link as={Link} to="/appointment-history">Appointment History</Nav.Link>
            
            <Nav.Link as={Link} to="/doctor-availability">Doctor Availability and Booking</Nav.Link>
            <Nav.Link as={Link} to="/notifications">Messages</Nav.Link>
            <Nav.Link as={Link} to="/predict-disease">Disease Prediction</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/help">Help Guide</Nav.Link>
          </>
        )}
        {role === 'lab-technician' && (
          <>
            <Nav.Link as={Link} to="/pending-reports">Check Requests</Nav.Link>
            <Nav.Link as={Link} to="/submitted-reports">Completed Reports</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/help">Help Guide</Nav.Link>
          </>
        )}
        {/* Add more role-based links as needed */}
      </Nav>
    </div>
  );
};

export default Sidebar;
