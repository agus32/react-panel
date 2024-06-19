import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

export const ActionForm = ({ actions }) => {
  const [formData, setFormData] = useState({
    field: '',
    condition: '',
    value: '',
    action: '',
    interval: '0h1m0s',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group controlId="field">
            <Form.Label>Field</Form.Label>
            <Form.Control
              as="select"
              name="field"
              value={formData.field}
              onChange={handleChange}
            >
              <option value="">Select field</option>
              {/* Map through actions fields */}
              {actions.fields.map((field, idx) => (
                <option key={idx} value={field}>
                  {field}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="condition">
            <Form.Label>Condition</Form.Label>
            <Form.Control
              as="select"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="">Select condition</option>
              {actions.conditions.map((condition, idx) => (
                <option key={idx} value={condition}>
                  {condition}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="value">
            <Form.Label>Value</Form.Label>
            <Form.Control
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="action">
            <Form.Label>Action</Form.Label>
            <Form.Control
              as="select"
              name="action"
              value={formData.action}
              onChange={handleChange}
            >
              <option value="">Select action</option>
              {actions.actions.map((action, idx) => (
                <option key={idx} value={action.name}>
                  {action.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="interval">
            <Form.Label>Interval</Form.Label>
            <Form.Control
              type="text"
              name="interval"
              value={formData.interval}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="message">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="message"
          value={formData.message}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
      <Button variant="danger" onClick={() => setFormData({
          field: '',
          condition: '',
          value: '',
          action: '',
          interval: '0h1m0s',
          message: ''
        })}>
        Delete condition
      </Button>
    </Form>
  );
};

