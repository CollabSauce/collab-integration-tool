import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'src/styles/theme.scss';
import { CssEditor } from 'src/components/CssEditor';

const App = () => {
  const [ready, setReady] = useState(false);
  const [fullToolbarVisible, setFullToolbarVisible] = useState(false);
  const dispatch = useDispatch();
  const parentOrigin = useSelector((state) => state.app.parentOrigin);

  // Initialize the app - this should only be run once (on mount)
  useEffect(() => {
    dispatch.app.initializeApp().finally(() => {
      setReady(true);
    });
  }, [dispatch.app]);

  const hideToolBar = () => {
    const message = { type: 'hideToolbar' };
    window.parent.postMessage(JSON.stringify(message), parentOrigin);
    setFullToolbarVisible(false);
  };

  const enterSelectionMode = () => {
    const message = { type: 'enterSelectionMode' };
    window.parent.postMessage(JSON.stringify(message), parentOrigin);
  };

  const toggleFullToolbar = () => {
    if (fullToolbarVisible) {
      const message = { type: 'hideFullToolbar' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
    } else {
      const message = { type: 'showFullToolbar' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
    }
    setFullToolbarVisible(!fullToolbarVisible);
  };

  if (!ready) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="vh-100 d-flex">
      {fullToolbarVisible && <div className="flex-grow-1"></div>}
      <div className="h-100 d-flex flex-column justify-content-between align-items-center py-3 w-60">
        <p>collab</p>
        <Button onClick={enterSelectionMode}>
          <FontAwesomeIcon icon="plus" />
        </Button>
        <Button onClick={hideToolBar} className="text-body" variant="link">
          {'>'}
        </Button>
      </div>
    </div>
  );
};

export default App;
