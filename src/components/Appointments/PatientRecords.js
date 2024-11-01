import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Table, Container, Button, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // Assuming you have AuthContext for managing user state

const PatientRecords = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointmentsData);
    };

    fetchAppointments();
  }, []);

  const handleViewDetailsClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center">Patient Records</h2>
      <div className="table-responsive">
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Doctor</th>
            <th>Appointment Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={appointment.id}>
              <td>{index + 1}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.doctorName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.status}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleViewDetailsClick(appointment)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Patient Name:</strong> {selectedAppointment?.patientName}</p>
          <p><strong>Doctor Name:</strong> {selectedAppointment?.doctorName}</p>
          <p><strong>Date:</strong> {selectedAppointment?.date}</p>
          <p><strong>Status:</strong> {selectedAppointment?.status}</p>
          <p><strong>Diagnosis:</strong> {selectedAppointment?.diagnosis ? selectedAppointment?.diagnosis : "N/A"}</p>
          <p><strong>Prescription:</strong> {selectedAppointment?.prescription ? selectedAppointment?.prescription : "N/A"}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PatientRecords;