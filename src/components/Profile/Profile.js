import React, { useEffect, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import womenProfile from '../../assets/Images/profile.png';
import menProfile from '../../assets/Images/man.png';
import SuccessModal from '../../components/Common/SuccessModal'; // Import the SuccessModal component

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setEditData(docSnap.data()); // Initialize edit data with user data
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // Save updated profile data to Firestore
  const handleSaveChanges = async () => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      try {
        await updateDoc(docRef, editData);
        setUserData(editData); // Update the displayed data
        setIsEditing(false); // Exit edit mode
        setShowSuccessModal(true); // Show success modal
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  return (
    <Container className="mt-5">
      <section className="">
        <div className="row align-items-center"> {/* Add align-items-center for vertical centering */}
          <div className="col-3 d-flex justify-content-center"> {/* Center horizontally as well */}
            <div className="text-center mb-4">
              <img
                src={userData?.gender === "female" ? womenProfile : menProfile}
                alt="Profile Picture"
                className="img-fluid rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-9">
            <div className="bg-light p-4 rounded-3 shadow-sm w-100" style={{ maxWidth: '600px' }}>
              <Form>
                <Form.Group className="mb-3" controlId="editDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="displayName"
                    value={editData.displayName || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="editRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={editData.role || ""} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="">Select Role</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="editDateOfBirth">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={editData.dateOfBirth || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="editGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select name="gender" value={editData.gender || ""} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="editPlace">
                  <Form.Label>Place</Form.Label>
                  <Form.Control
                    type="text"
                    name="place"
                    value={editData.place || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>

                <div className="text-center">
                  {isEditing ? (
                    <>
                      <Button variant="success" onClick={handleSaveChanges} className="me-2">
                        Save Changes
                      </Button>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="success" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal 
        show={showSuccessModal} 
        onHide={() => setShowSuccessModal(false)} 
        message="Profile updated successfully!" 
      />
    </Container>
  );
};

export default Profile;
