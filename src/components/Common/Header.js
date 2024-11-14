import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import logo from "../../assets/Images/logo.png";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleNavLinkClick = () => {
    setExpanded(false); // Close the menu
  };

  const handleBrandClick = async () => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role;

        if (role === "patient") {
          navigate("/profile");
        } else if (role === "doctor") {
          navigate("/profile");
        } else if (role === "admin") {
          navigate("/profile");
        } else if (role === "lab-technician") {
          navigate("/profile");
        }
      } else {
        console.log("No such document!");
      }
    } else {
      // Redirect to the home page
      navigate('/');
    }
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" expanded={expanded} className="header">
      <Container>
        <Navbar.Brand onClick={handleBrandClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '45px', marginRight: '10px' }} />
          <span style={{ fontFamily: 'Poppins, sans-serif' }}>Care Connect</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          <Nav className="ms-auto">
            {currentUser ? (
              <>
                
                <Nav.Link onClick={() => { logout(); handleNavLinkClick(); }} className="btn btn-dark d-flex align-items-center" style={{color: 'white'}}>
                  <FontAwesomeIcon icon={faSignOut} style={{ marginRight: '10px', color: 'white' }} />
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-dark d-flex align-items-center" style={{color: 'white'}} onClick={handleNavLinkClick}>
                  <FontAwesomeIcon icon={faSignIn} style={{ marginRight: '10px' }} />
                  Login
                </Nav.Link>
                
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;