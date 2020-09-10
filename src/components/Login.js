import React from 'react';
import { Col, Row } from 'reactstrap';

import BaseCardLayout from 'src/layouts/BaseCardLayout';
import LoginForm from 'src/components/cards/LoginForm';

const Login = () => (
  <BaseCardLayout>
    <>
      <Row className="text-left justify-content-between">
        <Col xs="auto">
          <h5>Log in</h5>
        </Col>
        <Col xs="auto">
          <p className="fs--1 text-600">
            or{' '}
            <a href="https://app.collabsauce.com/signup" target="_blank" rel="noopener noreferrer">
              create an account
            </a>
          </p>
        </Col>
      </Row>
      <LoginForm />
    </>
  </BaseCardLayout>
);

export default Login;
