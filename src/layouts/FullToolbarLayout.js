import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FullToolbarLayout = ({ headerContent, children, footerContent }) => {
  const dispatch = useDispatch();

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 py-3 px-2 overflow-auto">
        <div className="d-flex justify-content-between">
          {headerContent ? headerContent : <div />}
          <FontAwesomeIcon className="clickable-icon" icon="times" onClick={() => dispatch.app.hideFullToolbar()} />
        </div>
        {children}
      </div>
      {footerContent}
    </div>
  );
};

export default FullToolbarLayout;
