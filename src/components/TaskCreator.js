import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, Input, Button, Spinner } from 'reactstrap';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import CssEditor from 'src/components/CssEditor';

const TaskCreator = () => {
  const dispatch = useDispatch();
  const newTaskTitle = useSelector((state) => state.app.newTaskTitle);
  const creatingTask = useSelector((state) => state.app.creatingTask);
  const cssCodeChanges = useSelector((state) => state.app.cssCodeChanges);

  const headerContent = <div className="text-sans-serif font-weight-bold">Create a Task</div>;
  const bodyContent = (
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
  const footerContent = (
    <Button
      color="primary"
      block
      onClick={dispatch.app.getInfoFromCommunicatorToCreateTask}
      className="mb-3"
      disabled={creatingTask || (!newTaskTitle && !cssCodeChanges)}
    >
      {creatingTask ? <Spinner color="light" /> : 'Submit'}
    </Button>
  );

  return (
    <FullToolbarLayout headerContent={headerContent} footerContent={footerContent}>
      {bodyContent}
    </FullToolbarLayout>
  );
};

export default TaskCreator;
