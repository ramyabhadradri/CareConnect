import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Table, Container, Button, Alert } from "react-bootstrap";
import emailjs from "emailjs-com";

const UpcomingAppointmentReminder = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        // Get today's date and convert to ISO string
        const today = new Date().toISOString().split('T')[0]; // format as YYYY-MM-DD

        const appointmentsQuery = query(
          collection(db, "appointments"), // Compare with today's date
          where("status", "==", "Pending") // Assuming status indicates a scheduled appointment
        );

        const querySnapshot = await getDocs(appointmentsQuery);
        const appointmentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(appointmentsData);
      } catch (err) {
        setError("Failed to fetch appointments. Please try again.");
      }
    };

    fetchUpcomingAppointments();
  }, []);

  const fetchPatientEmail = async (patientName) => {
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("displayName", "==", patientName) // Adjust field if needed
      );

      const querySnapshot = await getDocs(usersQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        console.log(userDoc);
        return userDoc.email; // Adjust based on your users document structure
      } else {
        setError("Patient email not found.");
        return null;
      }
    } catch (err) {
      setError("Failed to fetch patient email. Please try again.");
      return null;
    }
  };

  const handleSendNotification = async (patientName, doctorName, date) => {
    // Fetch the patient's email address
    const email = await fetchPatientEmail(patientName);

    if (!email) {
      console.error("No valid email address found for patient:", patientName);
      setError("Failed to fetch patient email. Please check the patient name.");
      return; // Exit if email is not found
    }

    console.log("Sending email to:", email, date);

    const templateParams = {
      to_email: email,
      patientName,
      doctorName,
      date,
    };

    emailjs.send(
      'hms_99imgf8',           // Your service ID from EmailJS
      'template_1yvfyji',      // Your template ID from EmailJS
      templateParams,
      '9xuaZ-RkGkuM_XFi6'      // Your public key from EmailJS
    )
    .then(response => {
      console.log("Email sent successfully:", response); // Debug: Log successful response
      setSuccess("Notification sent successfully!");
    })
    .catch(err => {
      console.error("Error sending email:", err); // Debug: Log error details
      setError("Failed to send notification. Please try again.");
    });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Upcoming Appointments</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <tr key={appointment.id}>
                <td>{index + 1}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.date}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleSendNotification(
                      appointment.patientName,
                      appointment.doctorName,
                      appointment.date
                    )}
                  >
                    Send Email Notification
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No upcoming appointments.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default UpcomingAppointmentReminder;
