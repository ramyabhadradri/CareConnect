import React, { useState } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Form, Button, Alert, Container } from "react-bootstrap";

const AdminNotificationManager = () => {
  const [notification, setNotification] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (notification.trim() === "") {
      setError("Notification content cannot be empty.");
      return;
    }

    try {
      await addDoc(collection(db, "notifications"), {
        content: notification,
        createdAt: Timestamp.now(),
      });

      setSuccess("Notification sent successfully!");
      setNotification("");
    } catch (err) {
      setError("Failed to send notification. Please try again.");
    }
  };

  return (
    <Container>
      <h2 className="text-center m-4">Manage Notifications</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="notificationContent">
          <Form.Label>Notification Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            placeholder="Enter the notification content"
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-3">
          Send Notification
        </Button>
      </Form>
    </Container>
  );
};

export default AdminNotificationManager;
