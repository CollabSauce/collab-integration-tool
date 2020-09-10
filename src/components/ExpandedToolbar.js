import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FormGroup, Input, Button } from 'reactstrap';

import { jsdataStore } from 'src/store/jsdata';
import CssEditor from 'src/components/CssEditor';
import Login from 'src/components/Login';
import Logout from 'src/components/Logout';
import FullToolbarLayout from 'src/layouts/FullToolbarLayout';

const ExpandedToolbar = () => {
  const isAuthenticated = useSelector((state) => state.app.currentUserId);
  const showLogout = useSelector((state) => state.views.showLogout);
  const [commentText, setCommentText] = useState('');

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
  if (isAuthenticated) {
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
  } else if (false) {
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
