import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, UncontrolledTooltip } from 'reactstrap';

import BaseToolbarBottomButtons from 'src/components/BaseToolbarBottomButtons';
import tasksIcon from 'src/assets/tasks.svg';

const BaseToolbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.app.currentUserId);
  const showTaskCreator = useSelector((state) => state.views.showTaskCreator);

  const viewTasksClicked = () => {
    if (isAuthenticated) {
      dispatch.app.enterShowTasksSummaryMode();
    } else {
      dispatch.app.enterLoginMode();
    }
  };

  const plusButtonClicked = () => {
    if (isAuthenticated) {
      if (showTaskCreator) {
        // if we are on the task creator, we have to reset the state of it
        dispatch.styling.restoreChanges();
        dispatch.app.onExitTaskCreator();
      }
      dispatch.app.restoreDesignChange();
      dispatch.app.unselectTaskOnDom();
      dispatch.app.setCurrentTaskDetail(null);
      dispatch.app.enterSelectionMode();
      dispatch.views.setShowTasksSummary(true); // fallback to this view
    } else {
      dispatch.app.enterLoginMode();
    }
  };

  return (
    <div className="h-100 d-flex flex-column justify-content-between align-items-center pt-1 pb-3 w-60 min-w-60 bg-light">
      <div className="d-flex flex-column justify-content-between align-items-center">
        <p className="mb-0">collab</p>
        <hr className="mt-2 mb-4 mh-0 w-40" />
        <Button onClick={viewTasksClicked} outline color="secondary" id="collab-view-tasks" className="pl-12 pr-12">
          <img src={tasksIcon} alt="View Tasks" width={22} />
        </Button>
        <p className="mb-4">Tasks</p>
        <UncontrolledTooltip placement="auto" target="collab-view-tasks" innerClassName="collab-toolbar-tooltip">
          View Tasks
        </UncontrolledTooltip>
        <hr className="mt-0 mb-4 mh-0 w-40" />
        <Button onClick={plusButtonClicked} color="primary" id="collab-select-element">
          <FontAwesomeIcon icon="plus" />
        </Button>
        <UncontrolledTooltip placement="auto" target="collab-select-element" innerClassName="collab-toolbar-tooltip">
          Select Element
        </UncontrolledTooltip>
      </div>
      <BaseToolbarBottomButtons />
    </div>
  );
};

export default BaseToolbar;
