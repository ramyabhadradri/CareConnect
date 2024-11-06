import React from 'react';
import { Container, Row, Col, Tab, Nav, Card } from 'react-bootstrap';

const HelpGuide = () => {
  return (
    <Container>
      <Row className="my-4">
        <Col md={12}>
          <h2 className="text-center">Help Guide</h2>
          <p className="text-center">Welcome to the Care Connect Help Guide. Here you'll find all the information you need to navigate and use the application efficiently.</p>
        </Col>
      </Row>

      {/* Tabs for different sections */}
      <Tab.Container id="help-guide-tabs" defaultActiveKey="0">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="0">General Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="1">For Patients</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="2">For Doctors</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="3">For Lab Technicians</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="4">For Admins</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={8} className="mb-5">
            <Tab.Content>
              {/* General Overview Tab */}
              <Tab.Pane eventKey="0">
                <Card>
                  <Card.Body>
                    <p>Care Connect is a comprehensive healthcare platform designed to enhance the efficiency and quality of healthcare by allowing seamless communication between patients, doctors, lab technicians, and administrators. The platform supports various features like disease prediction, appointment booking, real-time doctor availability, lab report management, and role-based dashboards to help all users collaborate effectively.</p>
                    <p>The main goal of Care Connect is to streamline the patient care process, improve patient outcomes, and ensure that all users have the tools they need for fast, efficient, and accurate healthcare management.</p>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* For Patients Tab */}
              <Tab.Pane eventKey="1">
                <Card>
                  <Card.Body>
                    <h6>1. Register an Account</h6>
                    <p>To get started, navigate to the registration page where you will need to fill in your personal details, including your name, email address, phone number and other details. Once registered, you will receive a confirmation, and you can log in to access the platform.</p>

                    <h6>2. Book an Appointment</h6>
                    <p>After logging in, you can schedule an appointment by choosing the department you need, selecting an available doctor, and picking an appointment time that works for you.</p>

                    <h6>3. Check Disease Prediction</h6>
                    <p>The disease prediction tool allows you to input your symptoms, and the system will analyze them using medical data to suggest potential diseases or conditions. This can help you understand your health situation better and seek timely medical advice.</p>

                    <h6>4. View Appointment History</h6>
                    <p>After your appointment, you can easily check your appointment history on your dashboard. You’ll be able to view details about past consultations, including diagnosis and prescribed treatments.</p>

                    <h6>5. Receive Notifications</h6>
                    <p>You will receive notifications for upcoming appointments through mail so that you won't miss any appointments.</p>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* For Doctors Tab */}
              <Tab.Pane eventKey="2">
                <Card>
                  <Card.Body>
                    <h6>1. Manage Appointments</h6>
                    <p>As a doctor, you can view your upcoming appointments through the dashboard. You can see patient details. After completing an appointment, you can mark it as "completed" and provide the necessary prescription and diagnosis notes for the patient.</p>

                    <h6>2. Request Lab Reports</h6>
                    <p>If necessary, you can directly request lab reports from lab technicians. You can specify the lab you need for a patient and track the status of the report requests. Once the reports are ready,it will reflected in dashboard so you can review them and discuss with the patient.</p>

                    <h6>3. View Patient Information</h6>
                    <p>As a doctor, you have access to detailed patient records, including their medical history and previous consultations. This information will help you in diagnosing the patient's condition more effectively.</p>

                    <h6>4. Real-Time Doctor Availability</h6>
                    <p>You can check your real-time availability on the platform and update your available time slots. This helps patients book appointments based on your availability and ensures there are no scheduling conflicts.</p>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* For Lab Technicians Tab */}
              <Tab.Pane eventKey="3">
                <Card>
                  <Card.Body>
                    <h6>1. View Lab Reports</h6>
                    <p>Lab technicians can access patient lab reports and the status of any requests made by doctors. You can view pending tests, generate reports, and track the progress of ongoing tests.</p>

                    <h6>2. Generate Lab Reports and Bills</h6>
                    <p>Once lab tests are complete, you can generate the reports and bill patients accordingly. The system allows you to update the status of tests and communicate directly with the doctor.</p>

                    <h6>3. Respond to Doctor's Lab Requests</h6>
                    <p>If a doctor requests a lab report for a patient, you can respond to the request from your dashboard. You will be able to generate the required reports and send them directly to the requesting doctor.</p>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* For Admins Tab */}
              <Tab.Pane eventKey="4">
                <Card>
                  <Card.Body>
                    <h6>1. Manage Users</h6>
                    <p>As an admin, you can manage all the users of the platform, including patients, doctors, and lab technicians. You have the ability to add, update, or remove user accounts as necessary. Admins can also monitor user activity to ensure the smooth operation of the system.</p>

                    <h6>2. Manage Notifications</h6>
                    <p>Admins can create hospital notifications to keep users informed about important announcements, system updates, or any new features. Notifications are delivered to users via dashboard.</p>

                    <h6>3. Send Appointment Reminders</h6>
                    <p>Admins have the ability to send reminders for upcoming appointments to patients. These reminders can be sent via email and help ensure that patients don't miss their scheduled appointments.</p>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default HelpGuide;
