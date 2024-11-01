import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { doc, getDoc } from "firebase/firestore"; // Firestore methods for fetching data
import loginImage from "../../assets/Images/login.jpg"; // Import the image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userRole = userData.role;

        // Redirect based on user role
        switch (userRole) {
          case "patient":
            navigate("/profile");
            break;
          case "doctor":
            navigate("/profile");
            break;
          case "lab-technician":
            navigate("/pending-reports");
            break;
          case "admin":
            navigate("/manage-users");
            break;
          default:
            setError("Unknown user role.");
            break;
        }
      } else {
        setError("No user data found.");
      }
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center">
      <Row className="w-100 mt-5">
        {/* Form Section */}
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <div className="p-5 shadow-sm border rounded-5 border-success bg-white" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 className="text-center mb-4 text-success">Login Form</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  className="border border-success"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  className="border border-success"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

             

              <div className="d-grid">
                <Button className="btn btn-success" type="submit">
                  Login
                </Button>
              </div>
            </Form>

            <div className="mt-3">
              <p className="mb-0 text-center">
                Don't have an account?{" "}
                <a href="/register" className="text-success fw-bold">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </Col>

        {/* Image Section */}
        <Col md={4} className="d-none d-md-block">
          <img
            src={loginImage}
            alt="Login"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
