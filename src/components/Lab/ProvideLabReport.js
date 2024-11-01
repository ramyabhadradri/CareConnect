import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // Assuming you have AuthContext for managing user state
import { useNavigate, useParams } from "react-router-dom";

const ProvideLabReport = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { reportId } = useParams(); // Get the report ID from URL params
  console.log("Lab Report ID:", reportId);

  const [labReport, setLabReport] = useState(null);
  const [reportDetails, setReportDetails] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const docRef = doc(db, "labreports", reportId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLabReport(docSnap.data());
        } else {
          setError("No such lab report request found.");
        }
      } catch (err) {
        setError("Failed to fetch lab report data.");
      }
    };

    fetchReportData();
  }, [reportId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!labReport) return;

    try {
      // Update the lab report with provided details
      const labReportRef = doc(db, "labreports", reportId);
      await updateDoc(labReportRef, {
        reportDetails,
        status: "Completed",
      });

      // Generate and save bill details
      await addDoc(collection(db, "bills"), {
        appointmentId: labReport.appointmentId,
        labName: labReport.labName,
        billAmount,
        date: new Date().toISOString(),
      });

      // Update appointment status to 'Pending Lab Report'
      const appointmentRef = doc(db, "appointments", labReport.appointmentId);
      await updateDoc(appointmentRef, { status: "Pending" });

      setSuccess("Lab report submitted and bill generated successfully!");
      setReportDetails("");
      setBillAmount("");

      // Navigate back to lab report requests
      navigate("/pending-reports");
    } catch (err) {
      setError("Failed to submit lab report. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Provide Lab Report</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Report Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bill Amount</Form.Label>
              <Form.Control
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Submit Lab Report
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProvideLabReport;
