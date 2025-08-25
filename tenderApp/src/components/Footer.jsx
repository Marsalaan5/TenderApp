import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6} >
            <h5>Tender Web</h5>
            <p>&copy; {new Date().getFullYear()} TenderWeb. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>
              <a href="/privacy" className="text-light text-decoration-none me-3">Privacy Policy</a>
              <a href="/terms" className="text-light text-decoration-none">Terms & Conditions</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
