import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Table, Button, Container, Modal, Form, Alert } from 'react-bootstrap';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    dateOfBirth: '',
    place: '',
    gender: '',
    displayName: '',
    role: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUserData({
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      place: user.place,
      gender: user.gender,
      displayName: user.displayName,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, userData);
      setSuccessMessage('User updated successfully!');
      setShowEditModal(false);
      setSelectedUser(null);
      // Refresh user list
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error updating user:', error);
      setSuccessMessage('Failed to update user.');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await deleteDoc(userRef);
      setSuccessMessage('User deleted successfully!');
      setShowDeleteModal(false);
      setSelectedUser(null);
      // Refresh user list
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error deleting user:', error);
      setSuccessMessage('Failed to delete user.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Manage Users</h2>
      {successMessage && (
        <Alert variant={successMessage.includes('successfully') ? 'success' : 'danger'} onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}
      <div className="table-responsive mb-3">
      <Table striped bordered hover className="mt-4 mb-5">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Place</th>
            <th>Gender</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>{user.dateOfBirth}</td>
              <td>{user.place}</td>
              <td>{user.gender}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(user)}>Edit</Button>
                <Button variant="danger" className="ms-2" onClick={() => handleDeleteClick(user)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>

      
      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={userData.displayName}
                onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={userData.dateOfBirth}
                onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Place</Form.Label>
              <Form.Control
                type="text"
                value={userData.place}
                onChange={(e) => setUserData({ ...userData, place: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                value={userData.gender}
                onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedUser?.displayName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageUsers;
