import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, UncontrolledTooltip, Input, Label } from 'reactstrap';

import BaseToolbarBottomButtons from 'src/components/BaseToolbarBottomButtons';
import { useCurrentProject } from 'src/hooks/useCurrentProject';
import tasksIcon from 'src/assets/tasks.svg';

const BaseToolbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.app.currentUserId);
  const gridlinesVisible = useSelector((state) => state.app.gridlinesVisible);

  const currentProject = useCurrentProject();
  const hasAccessToProject = !!currentProject;

  const viewTasksClicked = () => {
    dispatch.baseToolbar.setViewTasksClicked(true);
    if (isAuthenticated && hasAccessToProject) {
      dispatch.app.enterShowTasksSummaryMode();
    } else if (!isAuthenticated) {
      dispatch.app.enterLoginMode();
    } else {
      dispatch.app.enterNoProjectAccessMode();
    }
  };

  const plusButtonClicked = () => {
    dispatch.baseToolbar.setPlusButtonClicked(true);
    if (isAuthenticated && hasAccessToProject) {
      // In case the user is already in css-editor mode, exit out of this mode so design the css-editor view is reset
      dispatch.views.setShowCssEditor(false);
      dispatch.app.enterSelectionMode();
    } else if (!isAuthenticated) {
      dispatch.app.enterLoginMode();
    } else if (!hasAccessToProject) {
      dispatch.app.enterNoProjectAccessMode();
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
        <hr className="mt-5 mh-0 w-40" />
        <div id="collab-toggle-gridlines" className="d-flex flex-column align-items-center mt-30">
          <Label for="gridlines-checkbox" check>
            Gridlines
          </Label>
          <Input
            type="checkbox"
            name="check"
            id="gridlines-checkbox"
            className="input-inherit mt-1"
            value={gridlinesVisible}
            onChange={dispatch.app.toggleGridlines}
          />
        </div>
        <UncontrolledTooltip placement="auto" target="collab-toggle-gridlines" innerClassName="collab-toolbar-tooltip">
          Toggle Gridlines
        </UncontrolledTooltip>
      </div>
      <BaseToolbarBottomButtons />
    </div>
  );
};

export default BaseToolbar;
