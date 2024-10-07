import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './SuccessModal.css'; // Make sure to import your CSS

const SuccessModal = ({ show, onHide, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <div className="modal-confirm">
        <div className="modal-content">
          <div className="modal-header">
            <div className="icon-box">
              <i className="material-icons">&#xE876;</i>
            </div>
            <h4 className="modal-title w-100">Awesome!</h4>
          </div>
          <div className="modal-body">
            <p className="text-center">{message}</p>
          </div>
          <div className="modal-footer">
            <Button variant="success text-center" onClick={onHide} className="btn-block">
              OK
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
