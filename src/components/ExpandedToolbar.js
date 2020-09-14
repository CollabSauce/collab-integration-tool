import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, Input, Button, Spinner } from 'reactstrap';

import { useStoreState } from 'src/hooks/useStoreState';
import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import CssEditor from 'src/components/CssEditor';
import Login from 'src/components/Login';
import Logout from 'src/components/Logout';
import FailedLogin from 'src/components/FailedLogin';
import NoProjectAccess from 'src/components/NoProjectAccess';

const ExpandedToolbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.app.currentUserId);
  const projectKey = useSelector((state) => state.app.projectKey);
  const newTaskTitle = useSelector((state) => state.app.newTaskTitle);
  const creatingTask = useSelector((state) => state.app.creatingTask);

  const showLogout = useSelector((state) => state.views.showLogout);
  const showFailedLogin = useSelector((state) => state.views.showFailedLogin);

  // const [commentText, setCommentText] = useState('');
  const { result: projects } = useStoreState((store) => store.getAll('project'), [], 'project');
  const currentProject = useMemo(() => projects.find((p) => p.key === projectKey), [projects, projectKey]);
  const hasAccessToProject = !!currentProject;

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
            value={newTaskTitle}
            onChange={({ target }) => dispatch.app.setNewTaskTitle(target.value)}
            autoFocus
          />
        </FormGroup>

        <CssEditor />
      </>
    );
    footerContent = (
      <Button
        color="primary"
        block
        onClick={dispatch.app.getInfoFromCommunicatorToCreateTask}
        className="mb-3"
        disabled={creatingTask}
      >
        {creatingTask ? <Spinner color="light" /> : 'Create Task'}
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
