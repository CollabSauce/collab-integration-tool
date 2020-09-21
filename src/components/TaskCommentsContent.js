import React, { useState } from 'react';
import { Media, Form, Button } from 'reactstrap';
import Avatar from 'src/components/Avatar';

import { jsdataStore } from 'src/store/jsdata';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import Flex from 'src/components/Flex';
import CollabCommentRenderer from 'src/components/CollabCommentRenderer';
import CollabMentionInput from 'src/components/CollabMentionInput';

const TaskCommentsContent = ({ task, comments }) => {
  const [commentText, setCommentText] = useState('');
  const { result: currentUser } = useCurrentUser();
  const handleCreateTaskComment = async (event) => {
    event.preventDefault();
    const taskComment = {
      task: task.id,
      text: commentText,
    };

    await jsdataStore.getMapper('taskComment').createTaskComment({ data: taskComment });
    setCommentText('');
  };

  return (
    <>
      {comments.map((comment) => (
        <Media className="mb-3" key={comment.id}>
          <Avatar name={`${comment.creatorFullName}`} size="l" />
          <Media body className="ml-2 fs--1">
            <div className="mb-1 bg-200 rounded-soft p-2">
              <div className="font-weight-semi-bold">{`${comment.creatorFullName}`}</div>{' '}
              <CollabCommentRenderer content={comment.text} />
            </div>
          </Media>
        </Media>
      ))}
      <Media>
        <Avatar name={`${currentUser.firstName} ${currentUser.lastName}`} className="mr-2" size="l" />
        <Media body className="fs--1">
          <div className="position-relative border rounded">
            <Form onSubmit={handleCreateTaskComment}>
              <CollabMentionInput
                value={commentText}
                onChange={({ target }) => setCommentText(target.value)}
                className="border-0 rounded-bottom-0 fs--1"
                placeholder="Reply..."
              />
              <Flex justify="between" align="center" className="bg-light rounded-bottom p-2 mt-1">
                <Button size="sm" color="primary" type="submit" disabled={!commentText}>
                  Save
                </Button>
              </Flex>
            </Form>
          </div>
        </Media>
      </Media>
    </>
  );
};

export default TaskCommentsContent;
