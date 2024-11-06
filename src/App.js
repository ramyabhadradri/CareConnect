import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import Sidebar from "./components/Common/Sidebar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./components/Profile/Profile";
import PrivateRoute from "./components/Auth/PrivateRoute";
import BookAppointment from "./components/Appointments/BookAppointment";
import DoctorAvailability from "./components/Appointments/DoctorAvailability";
import PredictDisease from "./components/Prediction/PredictDisease";
import ManageUsers from "./components/Admin/ManageUsers";
import AppointmentHistory from "./components/Appointments/AppointmentHistory";
import AppointmentList from "./components/Appointments/AppointmentList";
import AdminNotificationManager from "./components/Notifications/AdminNotificationManager";
import PatientNotifications from "./components/Notifications/PatientNotifications";
import LabReportRequests from "./components/Lab/LabReportRequests";
import SubmittedReports from "./components/Lab/SubmittedReports.js";
import ProvideLabReport from "./components/Lab/ProvideLabReport";
import UpcomingAppointmentReminder from "./components/Mail/NotificationMailer";
import PatientRecords from "./components/Appointments/PatientRecords";
import HelpGuide from "./components/Common/HelpGuide";
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser, role } = useAuth();

  return (
    <Router>
      <Header />
      {currentUser && <Sidebar role={role} />} 
      <Container className="mt-3 main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/book-appointment" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
          <Route path="/doctor-availability" element={<PrivateRoute><DoctorAvailability /></PrivateRoute>} />
          <Route path="/predict-disease" element={<PrivateRoute><PredictDisease /></PrivateRoute>} />
          <Route path="/manage-users" element={<PrivateRoute><ManageUsers /></PrivateRoute>} />
          <Route path="/appointment-history" element={<PrivateRoute><AppointmentHistory /></PrivateRoute>} />
          <Route path="/appointments" element={<PrivateRoute><AppointmentList /></PrivateRoute>} />
          <Route path="/manage-notifications" element={<PrivateRoute><AdminNotificationManager /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><PatientNotifications /></PrivateRoute>} />
          <Route path="/pending-reports" element={<PrivateRoute><LabReportRequests /></PrivateRoute>} />
          <Route path="/submitted-reports" element={<PrivateRoute><SubmittedReports /></PrivateRoute>} />
          <Route path="/provide-lab-report/:reportId" element={<PrivateRoute><ProvideLabReport /></PrivateRoute>} />
          <Route path="/remind-users" element={<PrivateRoute><UpcomingAppointmentReminder /></PrivateRoute>} />
          <Route path="/patient-records" element={<PrivateRoute><PatientRecords /></PrivateRoute>} />
          <Route path="/help" element={<PrivateRoute><HelpGuide /></PrivateRoute>} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
