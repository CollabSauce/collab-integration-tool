import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FormGroup, Input, Button } from 'reactstrap';

import { jsdataStore } from 'src/store/jsdata';
import { useStoreState } from 'src/hooks/useStoreState';
import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import CssEditor from 'src/components/CssEditor';
import Login from 'src/components/Login';
import Logout from 'src/components/Logout';
import FailedLogin from 'src/components/FailedLogin';
import NoProjectAccess from 'src/components/NoProjectAccess';

const ExpandedToolbar = () => {
  const isAuthenticated = useSelector((state) => state.app.currentUserId);
  const showLogout = useSelector((state) => state.views.showLogout);
  const showFailedLogin = useSelector((state) => state.views.showFailedLogin);
  const projectKey = useSelector((state) => state.app.projectKey);
  const [commentText, setCommentText] = useState('');

  const { result: projects } = useStoreState((store) => store.getAll('project'), [], 'project');
  const hasAccessToProject = useMemo(() => projects.find((p) => p.key === projectKey), [projects, projectKey]);

  const createTask = async () => {
    const task = {
      // title: commentText,
      // target_dom_path: 'NONE',
      // project: parseInt(projectId),
      // task_column: parseInt(kanbanColumnItem.id),
    };

    const response = await jsdataStore.getMapper('task').createTask({ data: task });
    // onTaskCreated(response.data.task);
  };

  let headerContent = null,
    bodyContent = null,
    footerContent = null;

  if (isAuthenticated && !hasAccessToProject) {
    bodyContent = <NoProjectAccess />;
  } else if (isAuthenticated) {
    // TODO: Make own component??
    headerContent = <div className="text-sans-serif font-weight-bold">Create a Task</div>;
    bodyContent = (
      <>
        <FormGroup className="mt-3">
          <Input
            type="textarea"
            rows={3}
            className="no-resize collab-comment-box"
            placeholder="Type a comment..."
            aria-label="task comment"
            value={commentText}
            onChange={({ target }) => setCommentText(target.value)}
            autoFocus
          />
        </FormGroup>

        <CssEditor />
      </>
    );
    footerContent = (
      <Button color="primary" block onClick={createTask} className="mb-3">
        Create Task
      </Button>
    );
  } else if (showLogout) {
    bodyContent = <Logout />;
  } else if (showFailedLogin) {
    bodyContent = <FailedLogin />;
  } else {
    bodyContent = <Login />;
  }

  return (
    <FullToolbarLayout headerContent={headerContent} footerContent={footerContent}>
      {bodyContent}
    </FullToolbarLayout>
  );
};

export default ExpandedToolbar;
