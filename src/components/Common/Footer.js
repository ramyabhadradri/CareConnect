// components/Common/Footer.js
import React from "react";
import { Container } from "react-bootstrap";
import Style from "./comStyle.css";

const Footer = () => {
  return (
    <footer className="footer bg-success text-white text-center py-3 mt-5">
      <Container>
        <p className="py-2">Care Connect, A hospital service provider.</p>
      </Container>
    </footer>
  );
};

export default Footer;
