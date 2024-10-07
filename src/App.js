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
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
