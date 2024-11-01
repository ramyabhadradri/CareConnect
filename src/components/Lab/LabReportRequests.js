import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Table, Container, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // Assuming you have AuthContext for managing user state

const LabReportRequests = () => {
  const { currentUser } = useAuth();
  const [labReports, setLabReports] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user data found for the current user.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchLabReports = async () => {
      if (!currentUser || !userData) return;

      try {
        const labReportsQuery = query(
          collection(db, "labreports"),
          where("labName", "==", userData.labName),
          where("status", "==", "Pending")
        );

        const querySnapshot = await getDocs(labReportsQuery);
        const labReportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLabReports(labReportsData);
      } catch (error) {
        console.error("Error fetching lab reports: ", error);
      }
    };

    fetchUserData();
    fetchLabReports();
  }, [currentUser, userData]);

  return (
    <Container className="mt-5">
      <h2 className="text-center">Lab Report Requests</h2>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Doctor Name</th>
            <th>Patient Name</th>
            <th>Appointment Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {labReports.map((report, index) => (
            <tr key={report.id}>
              <td>{index + 1}</td>
              <td>{report.doctorName}</td>
              <td>{report.patientName}</td>
              <td>{report.appointmentDate}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => window.location.href = `/provide-lab-report/${report.id}`}
                >
                  Provide Lab Report
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LabReportRequests;
