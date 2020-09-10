import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';

import { setAuthToken } from 'src/utils/auth';

const BaseToolbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.app.currentUserId);

  const plusButtonClicked = () => {
    if (isAuthenticated) {
      dispatch.app.enterSelectionMode();
    } else {
      dispatch.app.enterLoginMode();
    }
  };

  const logout = () => {
    dispatch.views.setShowLogout(true);
    setAuthToken();
    dispatch.app.setCurrentUserId();
    dispatch.app.showFullToolbar();
  };

  return (
    <div className="h-100 d-flex flex-column justify-content-between align-items-center pt-1 pb-3 m-w-60 bg-light">
      <div>
        <p>collab</p>
        <Button onClick={plusButtonClicked} color="primary">
          <FontAwesomeIcon icon="plus" />
        </Button>
        {isAuthenticated && (
          <Button onClick={logout} color="link">
            Logout
          </Button>
        )}
      </div>
      <FontAwesomeIcon className="clickable-icon" icon="angle-right" onClick={() => dispatch.app.hideToolbar()} />
    </div>
  );
};

export default BaseToolbar;
