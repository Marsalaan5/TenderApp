import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState(null); // success or error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    // Here you would normally send formData to your backend API
    // For demo, we'll just show success message
    setStatus({ type: 'success', message: 'Thank you for contacting us! We will get back to you soon.' });

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2>Contact Us</h2>
          <p>Have questions or want to know more? Send us a message!</p>

          {status && (
            <Alert variant={status.type === 'success' ? 'success' : 'danger'}>
              {status.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="contactName" className="mb-3">
              <Form.Label>Name <span style={{color: 'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Your full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="contactEmail" className="mb-3">
              <Form.Label>Email <span style={{color: 'red'}}>*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="Your email address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="contactSubject" className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Subject (optional)"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="contactMessage" className="mb-3">
              <Form.Label>Message <span style={{color: 'red'}}>*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write your message here"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
