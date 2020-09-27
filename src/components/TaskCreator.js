import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, Button, Spinner } from 'reactstrap';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import CssEditor from 'src/components/CssEditor';
import CollabMentionInput from 'src/components/CollabMentionInput';
import AssignSelect from 'src/components/AssignSelect';

const TaskCreator = () => {
  const dispatch = useDispatch();
  const newTaskTitle = useSelector((state) => state.app.newTaskTitle);
  const creatingTask = useSelector((state) => state.app.creatingTask);
  const cssCodeChanges = useSelector((state) => state.styling.cssCodeChanges);
  const createTaskAssigneeValue = useSelector((state) => state.app.createTaskAssigneeValue);

  useEffect(() => {
    // upon entering this component, reset the `taskSuccessfullyCreated` property
    dispatch.app.setTaskSuccessfullyCreated(false);
    return () => dispatch.app.onExitTaskCreator();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch.app.setCreateTaskAssigneeValue(null);
  }, [dispatch.app]);

  const headerContent = <div className="text-sans-serif font-weight-bold">Create a Task</div>;
  const bodyContent = (
    <>
      <FormGroup className="mt-3">
        <CollabMentionInput
          placeholder="Type a comment..."
          className="collab-comment-box"
          aria-label="task comment"
          value={newTaskTitle}
          onChange={({ target }) => dispatch.app.setNewTaskTitle(target.value)}
          autoFocus
        />
      </FormGroup>

      <AssignSelect
        value={createTaskAssigneeValue}
        onChange={(option) => dispatch.app.setCreateTaskAssigneeValue(option)}
      />

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
