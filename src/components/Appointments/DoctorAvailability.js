import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col, ListGroup } from "react-bootstrap";
import { db } from "../../firebase/config";
import { collection, query, where, doc, getDoc, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext"; // Importing Auth Context
import availabilityPNG from "../../assets/Images/availability.png";

const DoctorAvailability = () => {
  const { currentUser } = useAuth(); // Fetching current user from Auth Context
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState("");

  // Fetch doctors from Firestore
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const doctorsData = querySnapshot.docs
          .filter((doc) => doc.data().role === "doctor")
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setDoctors(doctorsData);
      } catch (err) {
        setError("Failed to fetch doctors. Please try again.");
      }
    };

    fetchDoctors();
  }, []);

  // Fetch user data to get the patient's name
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPatientName(docSnap.data().displayName);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDoctor || !selectedDate) return;

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const appointmentsQuery = query(
          collection(db, "appointments"),
          where("doctorName", "==", selectedDoctor),
          where("date", "==", selectedDate)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const allSlots = [
          "09:00 AM - 10:00 AM",
          "10:00 AM - 11:00 AM",
          "11:00 AM - 12:00 PM",
          "01:00 PM - 02:00 PM",
          "02:00 PM - 03:00 PM",
          "03:00 PM - 04:00 PM",
        ];

        const bookedSlots = appointmentsSnapshot.docs.map((doc) => doc.data().timeSlot);

        const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
        setAvailableSlots(availableSlots);
      } catch (err) {
        setError("Failed to fetch available slots. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDoctor, selectedDate]);

  const handleBooking = async (slot) => {
    const startTime = slot.split(" - ")[0]; // Extract the start time from the slot

    try {
      await addDoc(collection(db, "appointments"), {
        doctorName: selectedDoctor,
        date: selectedDate,
        timeSlot: startTime, // Store only the start time
        patientName: patientName, // Use the logged-in patient's name
        status: "Pending",
      });
      setSuccess(`Appointment booked for ${startTime} successfully!`);

      // Update available slots after booking
      setAvailableSlots((prevSlots) => prevSlots.filter((s) => s !== slot));
    } catch (err) {
      setError("Failed to book appointment. Please try again.");
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Doctor Availability</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="formDoctor">
              <Form.Label><strong>Select Doctor</strong></Form.Label>
              <Form.Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.displayName}>
                    {doctor.displayName} - {doctor.department}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label><strong>Select Date</strong></Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>
          </Form>

          {loading && <p>Loading...</p>}

          {availableSlots.length > 0 && (
            <ListGroup className="mb-5">
              {availableSlots.map((slot, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  {slot}
                  <Button variant="primary" onClick={() => handleBooking(slot)}>Book Appointment</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          {availableSlots.length === 0 && !loading && <p>No available slots for the selected date.</p>}
        </Col>
        <Col md={6}>
          <img src={availabilityPNG} alt="Appointment SVG" />
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorAvailability;
