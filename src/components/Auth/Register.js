import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Custom context for authentication
import { db } from "../../firebase/config";
import { setDoc, doc } from "firebase/firestore";
import singUpImg from "../../assets/Images/register.png";
import { updateProfile } from "firebase/auth";
import SuccessModal from '../../components/Common/SuccessModal'; // Import the SuccessModal component

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
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal

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

      // Show success modal
      setShowSuccessModal(true);

      // Redirect after the modal is closed (you can customize the redirect here)
      setTimeout(() => {
        if (role === "patient") {
          navigate("/profile");
        } else if (role === "doctor") {
          navigate("/profile");
        } else if (role === "lab-technician") {
          navigate("/pending-reports");
        } else if (role === "admin") {
          navigate("/manage-users");
        }
      }, 4000); // Delay navigation to allow user to see the modal

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
          <Form id="displayName" onSubmit={handleSubmit}>
            <Form.Group id="displayName" className="mb-3">
              <Form.Label htmlFor="displayName"><strong>Full Name</strong></Form.Label>
              <Form.Control
                id="displayName"
                type="text"
                required
                placeholder="Enter your full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="email" className="mb-3">
              <Form.Label htmlFor="email"><strong>Email Address</strong></Form.Label>
              <Form.Control
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="password" className="mb-3">
              <Form.Label htmlFor="password"><strong>Password</strong></Form.Label>
              <Form.Control
                id="password"
                type="password"
                required
                placeholder="Enter a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="confirmPassword" className="mb-3">
              <Form.Label htmlFor="confirmPassword"><strong>Confirm Password</strong></Form.Label>
              <Form.Control
                id="confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="dateOfBirth" className="mb-3">
              <Form.Label htmlFor="dateOfBirth"><strong>Date of Birth</strong></Form.Label>
              <Form.Control id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </Form.Group>
            <Form.Group id="gender" className="mb-3">
              <Form.Label htmlFor="gender"><strong>Gender</strong></Form.Label>
              <Form.Select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </Form.Select>
            </Form.Group>
            <Form.Group id="place" className="mb-3">
              <Form.Label htmlFor="place"><strong>City</strong></Form.Label>
              <Form.Control
                id="place"
                type="text"
                required
                placeholder="Enter your place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="bloodGroup" className="mb-3">
              <Form.Label htmlFor="bloodGroup"><strong>Blood Group</strong></Form.Label>
              <Form.Select
                id="bloodGroup"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </Form.Select>
            </Form.Group>

            <Form.Group id="mobile" className="mb-3">
              <Form.Label htmlFor="mobile"><strong>Mobile Number</strong></Form.Label>
              <Form.Control
                id="mobile"
                type="text"
                required
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Form.Group>
            <Form.Group id="role" className="mb-3">
              <Form.Label htmlFor="role"><strong>Role</strong></Form.Label>
              <Form.Select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
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
                <Form.Label htmlFor="labName"><strong>Lab Name</strong></Form.Label>
                <Form.Select id="labName" value={labName} onChange={(e) => setLabName(e.target.value)}>
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
              className="w-100 mt-3 mb-5 p"
              variant="success"
              type="submit"
            >
              Register
            </Button>
          </Form>
          <div className="mb-5"></div>
        </Col>
        <Col md={5}>
          <img className="HomeStyle.img" src={singUpImg} alt="signup SVG" />
        </Col>
      </Row>

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        message="Registration successful!"
      />
    </Container>
  );
};

export default Register;
