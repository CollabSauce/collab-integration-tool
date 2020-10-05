import React from 'react';
import { useSelector } from 'react-redux';

import Login from 'src/components/Login';
import Logout from 'src/components/Logout';
import FailedLogin from 'src/components/FailedLogin';
import TasksSummary from 'src/components/TasksSummary';
import TaskCreator from 'src/components/TaskCreator';
import NoProjectAccess from 'src/components/NoProjectAccess';

const ExpandedToolbar = () => {
  const showLogin = useSelector((state) => state.views.showLogin);
  const showLogout = useSelector((state) => state.views.showLogout);
  const showFailedLogin = useSelector((state) => state.views.showFailedLogin);
  const showTasksSummary = useSelector((state) => state.views.showTasksSummary);
  const showTaskCreator = useSelector((state) => state.views.showTaskCreator);
  const showNoProjectAccess = useSelector((state) => state.views.showNoProjectAccess);

  if (showLogin) {
    return <Login />;
  } else if (showLogout) {
    return <Logout />;
  } else if (showFailedLogin) {
    return <FailedLogin />;
  } else if (showTasksSummary) {
    return <TasksSummary />;
  } else if (showTaskCreator) {
    return <TaskCreator />;
  } else if (showNoProjectAccess) {
    return <NoProjectAccess />;
  }
};

export default ExpandedToolbar;
