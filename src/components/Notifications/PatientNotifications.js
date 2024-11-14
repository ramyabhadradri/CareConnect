import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { ListGroup, Container, Alert, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons"; // Import an icon

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      setError("");

      try {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const notificationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsData);
      } catch (err) {
        setError("Failed to load notifications. Please try again.");
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Messages</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <ListGroup>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <ListGroup.Item key={notification.id} className="d-flex align-items-center justify-content-between p-3 mb-3 col-9" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
              <div className="d-flex align-items-center">
               <FontAwesomeIcon className="text-warning me-3" size={24} icon={faBell} />
                <div>
                  <strong>{notification.title || "Message"}:</strong> {notification.content} <br />
                  <small className="text-muted">
                    <strong>Date:</strong> {new Date(notification.createdAt.seconds * 1000).toLocaleDateString()} <br />
                    <strong>Time:</strong> {new Date(notification.createdAt.seconds * 1000).toLocaleTimeString()}
                  </small>
                </div>
              </div>

              {/* Optional Badge for Notification Type */}
              <div>
                <Badge bg="dark" pill>{notification.type || "General"}</Badge>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <Alert variant="info">No notifications available.</Alert>
        )}
      </ListGroup>
    </Container>
  );
};

export default PatientNotifications;
