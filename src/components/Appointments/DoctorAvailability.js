import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col, ListGroup } from "react-bootstrap";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import availabilityPNG from "../../assets/Images/availability.png";

const DoctorAvailability = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDoctor || !selectedDate) return;

      setLoading(true);
      setError("");

      try {
        // Query for appointments on the selected date
        const appointmentsQuery = query(
          collection(db, "appointments"),
          where("doctorName", "==", selectedDoctor),
          where("date", "==", selectedDate)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        // Assuming slots are predefined and constant; otherwise, you might store them somewhere.
        const allSlots = [
          "09:00 AM - 10:00 AM",
          "10:00 AM - 11:00 AM",
          "11:00 AM - 12:00 PM",
          "01:00 PM - 02:00 PM",
          "02:00 PM - 03:00 PM",
          "03:00 PM - 04:00 PM",
        ];

        // Get booked slots
        const bookedSlots = appointmentsSnapshot.docs.map((doc) => doc.data().slot);

        // Calculate available slots
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

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Doctor Availability</h2>
          {error && <Alert variant="danger">{error}</Alert>}
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
            <ListGroup>
              {availableSlots.map((slot, index) => (
                <ListGroup.Item key={index}>{slot}</ListGroup.Item>
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
