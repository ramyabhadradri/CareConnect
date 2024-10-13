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
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
