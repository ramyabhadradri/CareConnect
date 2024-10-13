import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import appointmentPNG from "../../assets/Images/appointment.png";
import HomeStyle from '../Home/Home.css';

const BookAppointment = () => {
  const { currentUser } = useAuth();
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(null);
  const [timeSlots, setTimeSlots] = useState([
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const doctorsData = querySnapshot.docs
        .filter((doc) => doc.data().role === "doctor")
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setDoctors(doctorsData);
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setPatientName(docSnap.data().displayName);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (doctorName && date) {
        const q = query(
          collection(db, "appointments"),
          where("doctorName", "==", doctorName),
          where("date", "==", date)
        );
        const querySnapshot = await getDocs(q);

        const bookedSlots = querySnapshot.docs.map(doc => doc.data().timeSlot);
        const remainingSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

        setAvailableTimeSlots(remainingSlots);
      }
    };

    fetchAvailableTimeSlots();
  }, [doctorName, date]);

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "appointments"), {
        patientName,
        doctorName,
        date,
        timeSlot,
        status,
      });
      setSuccess("Appointment booked successfully!");
      setPatientName("");
      setDoctorName("");
      setDate("");
      setTimeSlot("");
    } catch (err) {
      setError("Failed to book appointment. Please try again.");
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col md={7}>
          <h2 className="text-center m-4">Schedule Appointment</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleBooking} className="mt-5">
            <Form.Group className="mb-3" controlId="formPatientName">
              <Form.Label><strong>Patient Name</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={patientName}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3 mt-5" controlId="formDoctorName">
              <Form.Label><strong>Doctor Name</strong></Form.Label>
              <Form.Select value={doctorName} onChange={(e) => setDoctorName(e.target.value)}>
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.displayName}>
                    {doctor.displayName} - {doctor.department}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 mt-5" controlId="formAppointmentDate">
              <Form.Label><strong>Appointment Date</strong></Form.Label>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Form.Group>

            {date && (
              <Form.Group className="mb-3 mt-5" controlId="formTimeSlot">
                <Form.Label><strong>Time Slot</strong></Form.Label>
                <Form.Select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                  <option value="">Select Time Slot</option>
                  {availableTimeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Button variant="success" type="submit" className="w-100 mt-5 mb-5">
              Book Appointment
            </Button>
          </Form>
        </Col>
        <Col md={5}>
          <img className="HomeStyle.img" src={appointmentPNG} alt="appointment SVG" />
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointment;
