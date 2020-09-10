import React from 'react';
import { Col, Row } from 'reactstrap';

import BaseCardLayout from 'src/layouts/BaseCardLayout';
import LoginForm from 'src/components/cards/LoginForm';

const Login = () => (
  <BaseCardLayout>
    <>
      <Row className="text-left justify-content-between mb-2">
        <Col xs="auto">
          <h5>Log in</h5>
        </Col>
      </Row>
      <LoginForm />
    </>
  </BaseCardLayout>
);

export default Login;
