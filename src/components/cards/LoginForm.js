import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col, FormGroup, Input, Label, Spinner } from 'reactstrap';
import * as Sentry from '@sentry/react';

import { jsdataStore } from 'src/store/jsdata';
import { setAuthToken } from 'src/utils/auth';

const LoginForm = ({ hasLabel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const plusButtonClicked = useSelector((state) => state.baseToolbar.plusButtonClicked);
  const projectKey = useSelector((state) => state.app.projectKey);
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
      const currentProject = jsdataStore.getAll('project').find((p) => p.key === projectKey);
      const hasAccessToProject = !!currentProject;
      if (hasAccessToProject) {
        dispatch.views.setShowTasksSummary(true);
      } else {
        dispatch.views.setShowNoProjectAccess(true);
      }
    } catch (err) {
      Sentry.captureException(err);
      setLoading(false);
      dispatch.views.setShowFailedLogin(true);
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
            href={`https://staging-collab-dashboard.netlify.app/forgot-password`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Forgot Password?
          </a>
        </Col>
      </Row>
      <FormGroup>
        <Button color="primary" block className="mt-3" disabled={isDisabled || loading}>
          {loading ? <Spinner color="light" /> : 'Log in'}
        </Button>
      </FormGroup>
      <p className="fs--1 text-600 text-center">
        or{' '}
        <a href="https://staging-collab-dashboard.netlify.app/signup" target="_blank" rel="noopener noreferrer">
          create an account
        </a>
      </p>
      {plusButtonClicked && (
        <Button outline color="info" block className="mt-3 px-2" onClick={() => dispatch.app.enterSelectionMode()}>
          Continue Without Login
        </Button>
      )}
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
