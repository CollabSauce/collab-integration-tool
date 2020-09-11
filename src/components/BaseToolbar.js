import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, UncontrolledTooltip } from 'reactstrap';

import { setAuthToken } from 'src/utils/auth';
import BaseToolbarBottomButtons from 'src/components/BaseToolbarBottomButtons';

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
    <div className="h-100 d-flex flex-column justify-content-between align-items-center pt-1 pb-3 w-60 min-w-60 bg-light">
      <div className="d-flex flex-column justify-content-between align-items-center">
        <p className="mb-0">collab</p>
        <hr className="mt-2 mb-4 mh-0 w-40" />
        <Button onClick={plusButtonClicked} color="primary" id="collab-select-element">
          <FontAwesomeIcon icon="plus" />
        </Button>
        <UncontrolledTooltip placement="auto" target="collab-select-element" innerClassName="collab-toolbar-tooltip">
          Select Element
        </UncontrolledTooltip>
        {isAuthenticated && (
          <Button onClick={logout} color="link" className="fs--1 pl-0 pr-0">
            Logout
          </Button>
        )}
      </div>
      <BaseToolbarBottomButtons />
    </div>
  );
};

export default BaseToolbar;
