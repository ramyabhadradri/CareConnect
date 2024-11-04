import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tabs, Tab, Alert, Button } from "react-bootstrap";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import appointmentPNG from "../../assets/Images/appointment.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock, faInfoCircle, faUserMd } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf"; // Import jsPDF

const AppointmentHistory = () => {
  const { currentUser } = useAuth();
  const [key, setKey] = useState('upcoming');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State to track the visibility of additional details for each completed appointment
  const [expandedAppointments, setExpandedAppointments] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError("");

      try {
        const appointmentsQuery = query(
          collection(db, "appointments"),
          where("patientName", "==", currentUser.displayName)
        );

        const querySnapshot = await getDocs(appointmentsQuery);
        const allAppointments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const now = new Date();
        const upcoming = allAppointments.filter((appointment) => {
          const appointmentDate = new Date(`${appointment.date}T00:00:00`);
          return appointmentDate > now;
        });

        const completed = allAppointments.filter((appointment) => {
          const appointmentDate = new Date(`${appointment.date}T00:00:00`);
          return appointmentDate <= now && appointment.status === 'Completed';
        });

        setUpcomingAppointments(upcoming);
        setCompletedAppointments(completed);

        // Fetch lab reports for completed appointments
        await fetchLabReports(completed);
      } catch (err) {
        setError("Failed to fetch appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  const fetchLabReports = async (completed) => {
    const reportsPromises = completed.map(async (appointment) => {
      const labReportsQuery = query(
        collection(db, "labreports"),
        where("appointmentId", "==", appointment.id)
      );
      console.log(appointment.id);
      const querySnapshot = await getDocs(labReportsQuery);
      const labReports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(labReports);
      return { ...appointment, labReports };
    });

    const completedWithReports = await Promise.all(reportsPromises);
    setCompletedAppointments(completedWithReports);
  };

  const handleToggleDetails = (appointmentId) => {
    setExpandedAppointments(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId]
    }));
  };

  const handleDownloadReport = (appointment) => {
  const doc = new jsPDF();
  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;

  // Title
  doc.setFontSize(18);
  doc.setFont("times", "bold");
  doc.text(`Lab Report`, margin, 20);
  
  // General Info
  doc.setFontSize(12);
  doc.setFont("times", "normal");
  doc.text(`Patient Name: ${appointment.patientName}`, margin, 40);
  doc.text(`Doctor Name: ${appointment.doctorName}`, margin, 50);
  doc.text(`Date: ${appointment.date}`, margin, 60);
  doc.text(`Time Slot: ${appointment.timeSlot}`, margin, 70);
  doc.text(`Status: ${appointment.status}`, margin, 80);
  
  // Lab Reports Section
  doc.setFont("times", "bold");
  doc.text(`Lab Reports:`, margin, 100);
  doc.setFont("times", "normal");

  if (appointment.labReports && appointment.labReports.length > 0) {
    appointment.labReports.forEach((report, index) => {
      const yPosition = 110 + (index * 60); // Adjust for spacing between reports
      doc.setFont("times", "bold");
      doc.text(`Lab Name: ${report.labName}`, margin, yPosition);
      doc.setFont("times", "normal");
      
      const reportDetailsLines = doc.splitTextToSize(`Report Details: ${report.reportDetails}`, pageWidth);
      doc.text(reportDetailsLines, margin, yPosition + 10); // Adjust the vertical position

      // Optional: Add a line or border
      doc.setDrawColor(200);
      doc.line(margin, yPosition + 20, pageWidth + margin, yPosition + 20); // Horizontal line
    });
  } else {
    doc.text(`No lab report available for this appointment.`, margin, 110);
  }

  // Save the document
  doc.save(`${appointment.patientName}_Report.pdf`);
};


  const renderAppointmentCard = (appointment) => (
    <div className="col-lg-4 col-md-6 mb-3" key={appointment.id}>
      <div className="card py-2 px-lg-5 h-100">
        <div className="card-body d-flex flex-column">
          <div className="text-center">
            <img src={appointmentPNG} className="img-fluid" alt="Appointment" />
          </div>
          <div className="card-title mb-4 text-center h5">Appointment with {appointment.doctorName}</div>
          <div className="pricing">
            <ul className="list-unstyled">
              <li className="mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span className="small ms-3">Date: {appointment.date}</span>
              </li>
              <li className="mb-3">
                <FontAwesomeIcon icon={faClock} />
                <span className="small ms-3">Time: {appointment.timeSlot}</span>
              </li>
              <li className="mb-3">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="small ms-3">Status: {appointment.status}</span>
              </li>
              <li className="mb-3">
                <FontAwesomeIcon icon={faUserMd} />
                <span className="small ms-3">Doctor: {appointment.doctorName}</span>
              </li>
            </ul>
          </div>
          <div className="text-center mt-auto">
            <Button variant="outline-success" onClick={() => handleToggleDetails(appointment.id)}>
              {expandedAppointments[appointment.id] ? "View Less" : "View More"}
            </Button>
            {expandedAppointments[appointment.id] && (
              <div className="mt-3">
                <p><strong>Prescription:</strong> {appointment.prescription}</p>
              </div>
            )}
            {/* Render download button only if lab reports exist */}
            {appointment.labReports && appointment.labReports.length > 0 && (
              <Button variant="outline-primary" onClick={() => handleDownloadReport(appointment)} className="ms-2">
                Download Report
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Container fluid>
      <Row className="align-items-center mb-5">
        <Col md={12}>
          <h2 className="text-center m-4">Appointment History</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && <p>Loading...</p>}

          <Tabs
            id="appointment-history-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="upcoming" title="Upcoming Appointments">
              <div className="container m-5">
                <div className="row">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => renderAppointmentCard(appointment))
                  ) : (
                    <p>No upcoming appointments.</p>
                  )}
                </div>
              </div>
            </Tab>

            <Tab eventKey="completed" title="Completed Appointments">
              <div className="container mt-5">
                <div className="row">
                  {completedAppointments.length > 0 ? (
                    completedAppointments.map((appointment) => renderAppointmentCard(appointment))
                  ) : (
                    <p>No completed appointments.</p>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentHistory;
