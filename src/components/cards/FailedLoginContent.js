import React from 'react';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';

const FailedLoginContent = () => {
  const dispatch = useDispatch();

  return (
    <>
      <p className="fs-4 mt--25">
        <span role="img" aria-label="siren">
          🚨
        </span>
      </p>
      <p>Your login didn’t work! It looks like you’re not registered with Collabsauce.</p>
      <p>
        Create an account now{' '}
        <span role="img" aria-label="down">
          👇
        </span>
      </p>
      <a href="https://staging-collab-dashboard.netlify.app/signup" target="_blank" rel="noopener noreferrer">
        <Button color="primary" block className="mt-3">
          Create an Account
        </Button>
      </a>
      <Button onClick={() => dispatch.views.setShowLogin(true)} color="link" className="mt-4 fs--1">
        Try logging in again
      </Button>
    </>
  );
};

export default FailedLoginContent;
