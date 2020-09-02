import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';

export const BaseToolbar = ({ enterSelectionMode, hideToolBar }) => {
  return (
    <div className="h-100 d-flex flex-column justify-content-between align-items-center pt-1 pb-3 w-60 bg-light">
      <p>collab</p>
      <Button onClick={enterSelectionMode}>
        <FontAwesomeIcon icon="plus" />
      </Button>
      <FontAwesomeIcon className="clickable-icon" icon="angle-right" onClick={hideToolBar} />
    </div>
  );
};
