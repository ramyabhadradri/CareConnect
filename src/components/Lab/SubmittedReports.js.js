import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Table, Container, Alert, Button, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const SubmittedReports = () => {
  const { currentUser } = useAuth();
  const [submittedReports, setSubmittedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmittedReports = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const labName = userData.labName;

          const reportsQuery = query(
  collection(db, "labreports"),
  where("labName", "==", labName),
  where("status", "==", "Completed")
);

          const querySnapshot = await getDocs(reportsQuery);
          const reportsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setSubmittedReports(reportsData);
        } else {
          console.log("No such user document!");
        }
      } catch (err) {
        setError("Failed to fetch submitted reports. Please try again.");
      }
    };

    fetchSubmittedReports();
  }, [currentUser]);
  console.log(submittedReports);

  const handleViewReport = async (reportId) => {
    try {
      const reportRef = doc(db, "labreports", reportId);
      const reportSnap = await getDoc(reportRef);

      if (reportSnap.exists()) {
        setSelectedReport(reportSnap.data());
        setShowModal(true);
      } else {
        setError("Report not found.");
      }
    } catch (err) {
      setError("Failed to fetch report details. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Submitted Lab Reports</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Appointment Date</th>
            <th>Report Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submittedReports.length > 0 ? (
            submittedReports.map((report, index) => (
              <tr key={report.id}>
                <td>{index + 1}</td>
                <td>{report.patientName}</td>
                <td>{report.doctorName}</td>
                <td>{report.appointmentDate}</td>
                <td>{report.status}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => handleViewReport(report.id)}
                  >
                    View Report
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No submitted reports available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for viewing report details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport ? (
            <>
              <h5>Patient Name:</h5>
              <p>{selectedReport.patientName}</p>
              <h5>Doctor Name:</h5>
              <p>{selectedReport.doctorName}</p>
              <h5>Appointment Date:</h5>
              <p>{selectedReport.appointmentDate}</p>
              <h5>Details:</h5>
              <p>{selectedReport.reportDetails || "No diagnosis provided"}</p>
              <h5>Status:</h5>
              <p>{selectedReport.status}</p>
            </>
          ) : (
            <p>Loading report details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SubmittedReports;
