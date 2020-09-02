import React from 'react';

import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CssEditor } from 'src/components/CssEditor';

export const ExpandedToolbar = ({ toggleFullToolbar }) => {
  return (
    <div className="flex-grow-1 py-3 px-2 overflow-auto">
      <div className="d-flex justify-content-between">
        <div className="text-sans-serif font-weight-bold">Create a Task</div>
        <FontAwesomeIcon className="clickable-icon" icon="times" onClick={toggleFullToolbar} />
      </div>
      <Form.Group controlId="commentArea" className="mt-3">
        <Form.Control as="textarea" rows="3" className="no-resize collab-comment-box" placeholder="Type a comment..." />
      </Form.Group>

      <CssEditor />
    </div>
  );
};
