import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, Button, Spinner, Input } from 'reactstrap';

import { useCurrentProject } from 'src/hooks/useCurrentProject';
import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import CssEditor from 'src/components/CssEditor';
import TextCopyEditor from 'src/components/TextCopyEditor';
import CollabMentionInput from 'src/components/CollabMentionInput';
import AssignSelect from 'src/components/AssignSelect';

const TaskCreator = () => {
  const dispatch = useDispatch();
  const showTaskCreatorEditors = useSelector((state) => state.views.showTaskCreatorEditors);
  const newTaskTitle = useSelector((state) => state.app.newTaskTitle);
  const creatingTask = useSelector((state) => state.app.creatingTask);
  const cssCodeChanges = useSelector((state) => state.styling.cssCodeChanges);
  const createTaskAssigneeValue = useSelector((state) => state.app.createTaskAssigneeValue);
  const createTaskEmailValue = useSelector((state) => state.app.createTaskEmailValue);
  const targetInnerText = useSelector((state) => state.app.targetInnerText);
  const targetInnerTextUpdated = useSelector((state) => state.app.targetInnerTextUpdated);
  const targetDomPath = useSelector((state) => state.app.targetDomPath);
  const isAuthenticated = useSelector((state) => state.app.currentUserId);
  const projectKey = useSelector((state) => state.app.projectKey);
  const currentProject = useCurrentProject();
  const textCopyChanges = targetInnerText !== targetInnerTextUpdated;
  const hasAccessToProject = !!currentProject;
  const canShowAssignSelect = isAuthenticated && hasAccessToProject;
  const canShowEmailInput = !canShowAssignSelect && projectKey; // if the user isn't showing the assingSelect, but the projectKey exists.
  const emailRequired = !canShowAssignSelect;
  const emailValid = createTaskEmailValue.length && createTaskEmailValue.includes('@');

  const textCopyEditorAllowed = useMemo(() => targetDomPath.toUpperCase() !== 'BODY', [targetDomPath]);

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

      {canShowAssignSelect && (
        <AssignSelect
          value={createTaskAssigneeValue}
          onChange={(option) => dispatch.app.setCreateTaskAssigneeValue(option)}
          className="mb-3"
        />
      )}

      {canShowEmailInput && (
        <div className="mt-2">
          <p className="mb-1 text-sans-serif font-weight-semi-bold">Email Address</p>
          <Input
            placeholder={'Email address'}
            value={createTaskEmailValue}
            onChange={({ target }) => dispatch.app.setCreateTaskEmailValue(target.value)}
            type="email"
            className="mb-3"
          />
        </div>
      )}

      {showTaskCreatorEditors && (
        <>
          {textCopyEditorAllowed && <TextCopyEditor />}
          <CssEditor />
        </>
      )}
    </>
  );
  // disable the create-task button if either the following are true:
  //   1) the task is currently in the middle of saving
  //   2) either the task-title or design changes or text-copy changes need to be filled out,
  //       so if they are all null values, then we should disable the button
  //   3) email is required and it is not valid
  const isDisabled =
    creatingTask || (!newTaskTitle && !cssCodeChanges && !textCopyChanges) || (emailRequired ? !emailValid : false);
  const footerContent = (
    <Button
      color="primary"
      block
      onClick={dispatch.app.getInfoFromCommunicatorToCreateTask}
      className="mb-3 min-h-36"
      disabled={isDisabled}
    >
      {creatingTask ? <Spinner color="light" /> : 'Submit'}
    </Button>
  );

  return (
    <FullToolbarLayout headerContent={headerContent} footerContent={projectKey ? footerContent : null}>
      {bodyContent}
    </FullToolbarLayout>
  );
};

export default TaskCreator;
