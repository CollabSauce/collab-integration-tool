import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Spinner } from 'reactstrap';

import 'src/styles/theme.scss';
import { BaseToolbar } from 'src/components/BaseToolbar';
import { ExpandedToolbar } from 'src/components/ExpandedToolbar';

const App = () => {
  const [ready, setReady] = useState(false);
  const [fullToolbarVisible, setFullToolbarVisible] = useState(false);
  const dispatch = useDispatch();
  const parentOrigin = useSelector((state) => state.app.parentOrigin);
  const targetDomPath = useSelector((state) => state.app.targetDomPath);

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

  useEffect(() => {
    if (targetDomPath) {
      setFullToolbarVisible(true);
    }
  }, [targetDomPath]);

  if (!ready) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner type="border" color="primary" />
      </div>
    );
  }

  return (
    <div className="vh-100 d-flex">
      {fullToolbarVisible && <ExpandedToolbar toggleFullToolbar={toggleFullToolbar} />}
      <BaseToolbar enterSelectionMode={enterSelectionMode} hideToolBar={hideToolBar} />
    </div>
  );
};

export default App;
