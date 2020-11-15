import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button, Input } from 'reactstrap';

const TextCopyEditor = () => {
  const dispatch = useDispatch();

  const parentOrigin = useSelector((state) => state.app.parentOrigin);
  const targetInnerText = useSelector((state) => state.app.targetInnerText);
  const targetInnerTextUpdated = useSelector((state) => state.app.targetInnerTextUpdated);
  const taskSuccessfullyCreated = useSelector((state) => state.app.taskSuccessfullyCreated);

  const hasTextCopyChanges = targetInnerText !== targetInnerTextUpdated;

  const onTextChange = ({ target }) => {
    const innerText = target.value;
    dispatch.app.setTargetInnerTextUpdated(innerText);
    // dispatch event to parent
    const message = { type: 'setTextCopy', innerText };
    window.parent.postMessage(JSON.stringify(message), parentOrigin);
  };

  useEffect(() => {
    return () => {
      // when exiting this css editor, if we are exiting with unsaved changes, restore all.
      if (!taskSuccessfullyCreated) {
        dispatch.app.restoreTextCopyChangesFromEditor();
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="mb-3">
      <div className="mb-2 d-inline-flex flex-grow-1 justify-content-between align-items-center w-100">
        <p className="mb-0 text-sans-serif font-weight-semi-bold p-height-31">Text Copy</p>
        {hasTextCopyChanges && (
          <Button color="falcon-danger fs--2 pl-2 pr-2" onClick={dispatch.app.restoreTextCopyChangesFromEditor}>
            Restore Changes
          </Button>
        )}
      </div>
      <Input
        placeholder={'Update text copy...'}
        value={targetInnerTextUpdated}
        onChange={onTextChange}
        type="textarea"
        name="text"
        className="no-resize"
      />
    </div>
  );
};

export default TextCopyEditor;
