import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Form, Row, Col, FormGroup, Input, Label, Spinner } from 'reactstrap';

import { jsdataStore } from 'src/store/jsdata';
import { setAuthToken } from 'src/utils/auth';
import { handleNetworkError } from 'src/utils/error';

const LoginForm = ({ hasLabel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const dispatch = useDispatch();

  // Handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const credentials = { email, password };
      const response = await jsdataStore.getMapper('user').loginUser({ data: credentials });
      setAuthToken(response.data.key);
      await dispatch.app.initializeApp();
      setLoading(false);
    } catch (e) {
      toast.error(handleNetworkError(e));
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsDisabled(!email || !password);
  }, [email, password]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        {hasLabel && <Label>Email address</Label>}
        <Input
          placeholder={!hasLabel ? 'Email address' : ''}
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          type="email"
        />
      </FormGroup>
      <FormGroup>
        {hasLabel && <Label>Password</Label>}
        <Input
          placeholder={!hasLabel ? 'Password' : ''}
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          type="password"
        />
      </FormGroup>
      <Row className="justify-content-between align-items-center">
        <Col xs="auto"></Col>
        <Col xs="auto">
          <a
            className="fs--1"
            href={`https://app.collabsauce.com/forgot-password`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Forget Password?
          </a>
        </Col>
      </Row>
      <FormGroup>
        <Button color="primary" block className="mt-3" disabled={isDisabled}>
          {loading ? <Spinner color="light" /> : 'Log in'}
        </Button>
      </FormGroup>
    </Form>
  );
};

LoginForm.propTypes = {
  hasLabel: PropTypes.bool,
};

LoginForm.defaultProps = {
  hasLabel: false,
};

export default LoginForm;
