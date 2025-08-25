import React from 'react';
import { Container, Row, Col, Form, Button, Accordion } from 'react-bootstrap';

function TenderAdvanceSearch() {
  return (
    <Container className="my-5">
      <h3 className="mb-4">Tender - Advance Search</h3>

      {/* Product & Services Section */}
      <div className="border p-3 bg-light mb-3">
        <h5>Product & Services Search Parameters</h5>
        <Row className="mb-2">
          <Col md={6}><Form.Control placeholder="Word Search" /></Col>
          <Col md={6}><Form.Control placeholder="Exact Phrase" /></Col>
        </Row>
        <Row className="mb-2">
          <Col md={6}><Form.Control placeholder="Product Name" /></Col>
          <Col md={6}><Form.Control placeholder="Sub Industry" /></Col>
        </Row>
        <Form.Check inline label="GEM" />
        <Form.Check inline label="Non GEM" />
        <Form.Check inline label="Free Tenders" />
      </div>

      {/* Other Parameter Sections */}
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="1">
          <Accordion.Header>Location Search Parameters</Accordion.Header>
          <Accordion.Body>
            <Form.Control placeholder="Enter Country, State, City, etc." />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Tendering Authority Search Parameters</Accordion.Header>
          <Accordion.Body>
            <Form.Control placeholder="Enter Company Name or Authority" />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Tender Search Parameters</Accordion.Header>
          <Accordion.Body>
            <Form.Control placeholder="Enter Tender Value, Type, Status, etc." />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mt-4 text-end">
        <Button variant="primary" className="me-2">Submit</Button>
        <Button variant="secondary">Clear</Button>
      </div>
    </Container>
  );
}

export default TenderAdvanceSearch;
