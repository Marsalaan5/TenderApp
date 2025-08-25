

import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { askAI } from '../services/api.js';

function AiAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');
    setError('');
    try {
      const res = await askAI(question);
      setAnswer(res.data.answer);
    } catch (err) {
      setError('Failed to get response from AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '700px' }}>
      <h2 className="text-center mb-4">Ask AI</h2>
      <Form onSubmit={handleSubmit} className="shadow p-4 rounded-3 bg-light">
        <Form.Group className="mb-4">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="form-control-lg"
          />
        </Form.Group>
        <Button 
          type="submit" 
          disabled={loading} 
          variant="primary" 
          className="w-100 py-2"
        >
          {loading ? <Spinner size="sm" animation="border" /> : 'Ask'}
        </Button>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-4 rounded-3 p-3">
          {error}
        </Alert>
      )}

      {answer && (
        <Alert variant="success" className="mt-4 rounded-3 p-3">
          <strong>AI says:</strong> {answer}
        </Alert>
      )}
    </Container>
  );
}

export default AiAssistant;
