import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Spinner } from 'reactstrap';

import 'src/styles/theme.scss';
import BaseToolbar from 'src/components/BaseToolbar';
import ExpandedToolbar from 'src/components/ExpandedToolbar';

const App = () => {
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();
  const fullToolbarVisible = useSelector((state) => state.app.fullToolbarVisible);

  // Initialize the app - this should only be run once (on mount)
  useEffect(() => {
    dispatch.app.initializeApp().finally(() => {
      setReady(true);
    });
  }, [dispatch.app]);

  if (!ready) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner type="border" color="primary" />
      </div>
    );
  }

  return (
    <div className="vh-100 d-flex">
      {fullToolbarVisible && <ExpandedToolbar />}
      <BaseToolbar />
    </div>
  );
};

export default App;
