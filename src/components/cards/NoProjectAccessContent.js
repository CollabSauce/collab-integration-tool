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
      <p>
        Your login worked! Unfortunately, it looks like you’re not part of this organizaiton. Please ask the
        administrator to add you in the dashboard.
      </p>
      <Button color="primary" block className="mt-3" onClick={() => dispatch.app.hideFullToolbar()}>
        Ok, got it
      </Button>
    </>
  );
};

export default FailedLoginContent;
