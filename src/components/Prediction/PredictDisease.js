import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Dropdown, DropdownButton, Alert, ListGroup, Badge, Modal } from 'react-bootstrap';
import predictPNG from "../../assets/Images/predict.png";
import Style from "./prediction.css";

const symptoms = [
  'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
  'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting',
  'vomiting', 'burning_micturition', 'spotting_ urination', 'fatigue', 'weight_gain',
  'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness',
  'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever',
  'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache',
  'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes',
  'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
  'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
  'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm',
  'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion',
  'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements',
  'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness',
  'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels',
  'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties',
  'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech',
  'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
  'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
  'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine',
  'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
  'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body',
  'belly_pain', 'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes',
  'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum',
  'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion',
  'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen',
  'history_of_alcohol_consumption', 'fluid_overload.1', 'blood_in_sputum',
  'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples',
  'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails',
  'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
].sort(); // Sort symptoms alphabetically

function PredictDisease() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [disease, setDisease] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  const handleSelect = (eventKey) => {
    if (!selectedSymptoms.includes(eventKey)) {
      setSelectedSymptoms([...selectedSymptoms, eventKey]);
    }
  };

  const handleRemove = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(item => item !== symptom));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDisease(null);
    setError(null);

    try {
      const response = await axios.post('https://disease-prediction-production.up.railway.app/predict', {
        symptoms: selectedSymptoms
      });
      setDisease(response.data.disease);
      setShowModal(true);
      setSelectedSymptoms([]);
    } catch (error) {
      setError('Error making prediction. Please try again.');
    }
  };

  const handleCloseModal = () => setShowModal(false);

  // Filter symptoms based on the search term
  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fullContainer">
      <Form onSubmit={handleSubmit}>
        <Form.Group id="symptoms">
          <Form.Label htmlFor="symptoms" className="mt-5"><h5>Select Symptoms</h5></Form.Label>
          <Form.Control 
            id="symptoms"
            type="text" 
            placeholder="Search symptoms..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <DropdownButton id="dropdown-basic-button" title="Choose Symptoms" onSelect={handleSelect} className="mt-3">
            {filteredSymptoms.map(symptom => (
              <Dropdown.Item key={symptom} eventKey={symptom}>
                {symptom}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Form.Group>
        <Button variant="success" type="submit" className="mt-3" disabled={selectedSymptoms.length === 0}>
          Predict Disease
        </Button>
      </Form>

      {selectedSymptoms.length > 0 && (
        <div className="row">
          <div className="mt-3 col-5">
            <h5>Selected Symptoms:</h5>
            <ListGroup>
              {selectedSymptoms.map(symptom => (
                <ListGroup.Item key={symptom} className="d-flex justify-content-between align-items-center">
                  {symptom}
                  <Button variant="danger" size="sm" onClick={() => handleRemove(symptom)}>
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <div className="col-5">
            <img src={predictPNG} alt="Predict Disease" />
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Disease Prediction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {disease ? `Predicted Disease: ${disease}` : 'No disease prediction available.'}
          <br />
          <p className="mt-3">Book an appointment and consult a doctor for further guidance.</p>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PredictDisease;
