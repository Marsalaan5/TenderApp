import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

function About() {
  return (
    <Container className="my-5">
      <Row className="align-items-center">
        <Col md={6}>
          <h2>About TenderWeb</h2>
          <p>
            TenderWeb is a centralized platform designed to make tender discovery and submission easier and more efficient.
            We help businesses, contractors, and government organizations stay connected and informed about the latest procurement opportunities.
          </p>
          <p>
            Whether you're a startup looking for your first government contract or a large enterprise managing hundreds of bids,
            TenderWeb provides the tools and insights to simplify your tendering process.
          </p>
        </Col>
        <Col md={6}>
          <Image
            src="https://source.unsplash.com/600x400/?business,contract"
            alt="About TenderWeb"
            fluid
            rounded
          />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h4>Our Mission</h4>
          <p>
            To democratize access to tender information by offering a transparent, searchable, and easy-to-use platform for everyone.
          </p>

          <h4>Why Choose Us?</h4>
          <ul>
            <li>Real-time updates on tenders</li>
            <li>Smart filters to find relevant opportunities</li>
            <li>AI-powered recommendations (coming soon!)</li>
            <li>Simple and intuitive user interface</li>
            <li>Secure and reliable data handling</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
