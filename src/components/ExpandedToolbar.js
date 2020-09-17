import React from 'react';
import { useSelector } from 'react-redux';

import { useCurrentProject } from 'src/hooks/useCurrentProject';
import Login from 'src/components/Login';
import Logout from 'src/components/Logout';
import FailedLogin from 'src/components/FailedLogin';
import NoProjectAccess from 'src/components/NoProjectAccess';
import TaskCreator from 'src/components/TaskCreator';
import TasksSummary from 'src/components/TasksSummary';
import TaskDetail from 'src/components/TaskDetail';

const ExpandedToolbar = () => {
  const isAuthenticated = useSelector((state) => state.app.currentUserId);

  const showLogout = useSelector((state) => state.views.showLogout);
  const showFailedLogin = useSelector((state) => state.views.showFailedLogin);
  const showTasksSummary = useSelector((state) => state.views.showTasksSummary);
  const showTaskDetail = useSelector((state) => state.views.showTaskDetail);
  const showTaskCreator = useSelector((state) => state.views.showTaskCreator);

  const currentProject = useCurrentProject();
  const hasAccessToProject = !!currentProject;

  if (isAuthenticated && !hasAccessToProject) {
    return <NoProjectAccess />;
  } else if (isAuthenticated && showTasksSummary) {
    return <TasksSummary />;
  } else if (isAuthenticated && showTaskDetail) {
    return <TaskDetail />;
  } else if (isAuthenticated && showTaskCreator) {
    return <TaskCreator />;
  } else if (showLogout) {
    return <Logout />;
  } else if (showFailedLogin) {
    return <FailedLogin />;
  } else {
    return <Login />;
  }
};

export default ExpandedToolbar;
