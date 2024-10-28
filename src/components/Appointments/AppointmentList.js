import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { Table, Container, Button, Modal, Form, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const AppointmentList = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);
  const [showRequestLabModal, setShowRequestLabModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [labName, setLabName] = useState("");
  const [prescription, setPrescription] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchAppointmentsRef = useRef(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchAppointmentsRef.current = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointmentsData);
      console.log(appointments);
    };

    fetchAppointmentsRef.current();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
    console.log(userData);
  }, [currentUser]);

  const handleMarkCompleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowMarkCompleteModal(true);
    setPrescription("");
    setDiagnosis("");
  };

  const handleRequestLabClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRequestLabModal(true);
    setLabName("");
  };

  const handleMarkCompleteSubmit = async () => {
    try {
      const appointmentDoc = doc(db, "appointments", selectedAppointment.id);
      await updateDoc(appointmentDoc, {
        status: "Completed",
        prescription,
        diagnosis,
      });
      setSuccessMessage("Appointment marked as completed successfully!");
      setShowMarkCompleteModal(false);
      setSelectedAppointment(null);
      fetchAppointmentsRef.current();
    } catch (err) {
      setErrorMessage("Failed to mark appointment as completed. Please try again.");
    }
  };

  const handleRequestLabSubmit = async () => {
    try {
      const appointmentDoc = doc(db, "appointments", selectedAppointment.id);
      await updateDoc(appointmentDoc, {
        status: "Pending Lab Report",
      });

      await addDoc(collection(db, "labreports"), {
        appointmentId: selectedAppointment.id,
        doctorName: selectedAppointment.doctorName,
        patientName: selectedAppointment.patientName,
        appointmentDate: selectedAppointment.date,
        labName,
        status: "Pending",
      });

      setSuccessMessage("Lab report requested successfully!");
      setShowRequestLabModal(false);
      setSelectedAppointment(null);
      fetchAppointmentsRef.current();
    } catch (err) {
      setErrorMessage("Failed to request lab report. Please try again.");
    }
  };

  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center">Appointments</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <div className="table-responsive">
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
              {userData?.role === "doctor" && (
                <th>Actions</th>
              )}
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
                {userData?.role === "doctor" && (
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      disabled={appointment.status === "Completed" || appointment.status === "Pending Lab Report" || userData?.displayName !== appointment.doctorName}
                      onClick={() => handleRequestLabClick(appointment)}
                    >
                      Request Lab Report
                    </Button>{" "}
                    <Button
                      variant="success"
                      size="sm"
                      disabled={appointment.status == "Pending Lab Report" || appointment.status == "Completed" || userData?.displayName !== appointment.doctorName}
                      onClick={() => handleMarkCompleteClick(appointment)}
                    >
                      Mark Completed
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Marking Appointment as Completed */}
      <Modal show={showMarkCompleteModal} onHide={() => setShowMarkCompleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mark Appointment Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to mark the appointment with patient {selectedAppointment?.patientName} as completed?</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Prescription</Form.Label>
              <Form.Control as="textarea" rows={3} value={prescription} onChange={(e) => setPrescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control as="textarea" rows={3} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMarkCompleteModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleMarkCompleteSubmit}>
            Mark Completed
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Requesting Lab Report */}
      <Modal show={showRequestLabModal} onHide={() => setShowRequestLabModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Lab Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Select a lab to request a report for the appointment with patient {selectedAppointment?.patientName}.</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Lab Name</Form.Label>
              <Form.Select value={labName} onChange={(e) => setLabName(e.target.value)}>
                <option value="">Select Lab</option>
                <option value="Central Lab">Central Lab</option>
                <option value="Diagnostic Lab">Diagnostic Lab</option>
                <option value="Pathology Lab">Pathology Lab</option>
                <option value="Microbiology Lab">Microbiology Lab</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRequestLabModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleRequestLabSubmit}>
            Request Lab Report
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentList;
