import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Custom context for authentication
import { db } from "../../firebase/config";
import { setDoc, doc } from "firebase/firestore";
import singUpImg from "../../assets/Images/register.png";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("patient"); // Default to patient
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male"); // Default to male
  const [place, setPlace] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [mobile, setMobile] = useState("");
  const [department, setDepartment] = useState(""); // Only for doctors
  const [labName, setLabName] = useState(""); // Only for lab technicians
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth(); // signup function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form validation
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      // Register user with Firebase Auth
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      // Create a user data object
      const userData = {
        displayName,
        email,
        role,
        dateOfBirth,
        gender,
        place,
        bloodGroup,
        mobile,
      };

      // Include department or labName based on the role
      if (role === "doctor") {
        userData.department = department;
      } else if (role === "lab-technician") {
        userData.labName = labName;
      }

      // Save additional user information to Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      // Redirect to the appropriate dashboard based on role
      if (role === "patient") {
        navigate("/patient-dashboard");
      } else if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (role === "lab-technician") {
        navigate("/pharmacy-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setError("Failed to create an account. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col md={6}>
          <h2 className="text-center m-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Registration</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="displayName" className="mb-3">
              <Form.Label><strong>Full Name</strong></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter your full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="email" className="mb-3">
              <Form.Label><strong>Email Address</strong></Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="password" className="mb-3">
              <Form.Label><strong>Password</strong></Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="Enter a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="confirmPassword" className="mb-3">
              <Form.Label><strong>Confirm Password</strong></Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="dateOfBirth" className="mb-3">
              <Form.Label><strong>Date of Birth</strong></Form.Label>
              <Form.Control type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </Form.Group>
            <Form.Group id="gender" className="mb-3">
              <Form.Label><strong>Gender</strong></Form.Label>
              <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group id="place" className="mb-3">
              <Form.Label><strong>Place</strong></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter your place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="bloodGroup" className="mb-3">
              <Form.Label><strong>Blood Group</strong></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter your blood group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="mobile" className="mb-3">
              <Form.Label><strong>Mobile Number</strong></Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="role" className="mb-3">
              <Form.Label><strong>Role</strong></Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="lab-technician">Lab Technician</option>
              </Form.Select>
            </Form.Group>
            {role === "doctor" && (
              <Form.Group id="department" className="mb-3">
                <Form.Label><strong>Department</strong></Form.Label>
                <Form.Select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Medicine">General Medicine</option>
                </Form.Select>
              </Form.Group>
            )}
            {role === "lab-technician" && (
              <Form.Group id="labName" className="mb-3">
                <Form.Label><strong>Lab Name</strong></Form.Label>
                <Form.Select value={labName} onChange={(e) => setLabName(e.target.value)}>
                  <option value="">Select Lab</option>
                  <option value="Central Lab">Central Lab</option>
                  <option value="Diagnostic Lab">Diagnostic Lab</option>
                  <option value="Pathology Lab">Pathology Lab</option>
                  <option value="Microbiology Lab">Microbiology Lab</option>
                </Form.Select>
              </Form.Group>
            )}
            <Button
              disabled={loading}
              className="w-100 mt-3 mb-5"
              variant="success"
              type="submit"
            >
              Register
            </Button>
          </Form>
        </Col>
        <Col md={5}>
          <img className="HomeStyle.img" src={singUpImg} alt="signup SVG" />
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
