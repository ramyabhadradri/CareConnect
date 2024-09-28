import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import Sidebar from "./components/Common/Sidebar"; // Import the Sidebar component
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser, role } = useAuth();

  return (
    <Router>
      <Header />
      {currentUser && <Sidebar role={role} />} {/* Render Sidebar if user is logged in */}
      <Container className="mt-3 main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
