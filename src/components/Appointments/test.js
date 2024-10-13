import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";

const UpdateProfile = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateProfile(currentUser, { displayName });
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile. " + error.message);
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleUpdate}>
        <Form.Group id="displayName" className="mb-3">
          <Form.Label><strong>Full Name</strong></Form.Label>
          <Form.Control
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Update</Button>
      </Form>
    </div>
  );
};

export default UpdateProfile;
