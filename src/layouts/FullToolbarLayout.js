import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FullToolbarLayout = ({ headerContent, children, footerContent, hidden }) => {
  const dispatch = useDispatch();

  return (
    <div className={`flex-column flex-grow-1 ${hidden ? 'd-none' : 'd-flex'}`}>
      <div className="flex-grow-1 py-3 px-2 overflow-auto d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center min-h-25">
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
