import React from 'react';
import { Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

const FailedLoginContent = () => {
  const dispatch = useDispatch();
  const plusButtonClicked = useSelector((state) => state.baseToolbar.plusButtonClicked);

  return (
    <>
      <p className="fs-4 mt--25">
        <span role="img" aria-label="siren">
          🚨
        </span>
      </p>
      <p>
        Your login worked! Unfortunately, it looks like you’re not part of this organization. Please ask the
        administrator to add you in the dashboard.
      </p>
      <Button color="primary" block className="mt-3 fs--1" onClick={() => dispatch.app.hideFullToolbar()}>
        Ok, got it
      </Button>
      {plusButtonClicked && (
        <Button
          outline
          color="info"
          block
          className="mt-3 px-2 fs--1"
          onClick={() => dispatch.app.enterSelectionMode()}
        >
          Continue Without Org Access
        </Button>
      )}
    </>
  );
};

export default FailedLoginContent;
