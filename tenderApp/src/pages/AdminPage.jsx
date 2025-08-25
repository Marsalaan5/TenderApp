import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { uploadTender } from '../services/api.js';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    state: '',
    sector: '',
    deadline: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await uploadTender(form);
      setSuccess('Tender uploaded successfully');
      setForm({ title: '', description: '', state: '', sector: '', deadline: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload tender');
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h2>Admin Panel - Upload Tender</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control name="title" value={form.title} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="state">
          <Form.Label>State</Form.Label>
          <Form.Control name="state" value={form.state} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="sector">
          <Form.Label>Sector</Form.Label>
          <Form.Control name="sector" value={form.sector} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="deadline">
          <Form.Label>Deadline</Form.Label>
          <Form.Control type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" className="w-100">Upload Tender</Button>
      </Form>
    </Container>
  );
}

export default AdminPage;
