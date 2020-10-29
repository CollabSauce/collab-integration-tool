import React, { useState, useMemo } from 'react';
import uniqBy from 'lodash/uniqBy';
import classNames from 'classnames';
import { Button, Card, CardBody, Badge, UncontrolledTooltip, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';

import TaskCommentsContent from 'src/components/TaskCommentsContent';
import CollapseHeader from 'src/components/CollapseHeader';
import Avatar from 'src/components/Avatar';
import CollabCommentRenderer from 'src/components/CollabCommentRenderer';
//
// const TaskColumnColorMap = {
//   'Raw Task': 'secondary',
//   'To-Do': 'primary',
//   'In Progress': 'light',
//   'In Review': 'info',
//   Done: 'warning',
//   Released: 'dark',
// };

const isParent = (obj, parentObj) => {
  while (obj !== undefined && obj !== null && obj.tagName.toUpperCase() !== 'BODY') {
    if (obj === parentObj) return true;
    obj = obj.parentNode;
  }
  return false;
};

const TaskCard = ({ taskCard, inDetailView }) => {
  const dispatch = useDispatch();
  const taskDomMap = useSelector((state) => state.app.taskDomMap);
  const textCopyChangeViewingTask = useSelector((state) => state.app.textCopyChangeViewingTask);
  const designChangeViewingTask = useSelector((state) => state.app.designChangeViewingTask);

  // const badgeColor = TaskColumnColorMap[taskCard.taskColumn.name];
  const taskFoundInDom = taskDomMap[taskCard.id];
  const viewingTextCopyChangeForCurrentTask = textCopyChangeViewingTask && textCopyChangeViewingTask.id === taskCard.id;
  const viewingDesignChangeForCurrentTask = designChangeViewingTask && designChangeViewingTask.id === taskCard.id;

  const [collapseOpen, setCollapseOpen] = useState(false);

  // NOTE NOTE NOTE: This was a bug in collab-dashboard, but just incase I'm addressing it here as well.
  // I Was using `useStoreState` for task comments, but for some reason, using
  // that for taskComments was causing infinite rerender loops. As a bandaid, I'm just using
  // the below line of code. It turns out that we dont even need `useStoreState` in this scenario anyways.
  // I.e, when adding a comment in the moda, the task card updates automatically anyways (probably because)
  // we are rerendering for some reason because the route changed.
  const taskComments = taskCard.taskComments;
  const uniqueCommentCreators = useMemo(() => {
    return uniqBy(taskComments, 'creatorId').map((comment) => ({
      fullName: comment.creatorFullName,
      id: comment.creatorId,
    }));
  }, [taskComments]);

  const onCopyToClipboard = () => toast.info('Copied to clipboard!');

  const viewTextCopyChange = () => {
    if (!taskFoundInDom) {
      return;
    }
    dispatch.app.viewTextCopyChange(taskCard);
  };

  const restoreTextCopyChange = () => {
    dispatch.app.restoreTextCopyChange();
  };

  const viewDesignChange = () => {
    if (!taskFoundInDom) {
      return;
    }
    dispatch.app.viewDesignChange(taskCard);
  };

  const restoreDesignChange = () => {
    dispatch.app.restoreDesignChange();
  };

  const onCardClicked = (e) => {
    const clickedElement = e.target;
    const textCopySection = document.getElementById(`taskcard-text-copy-section-${taskCard.id}`);
    const designSection = document.getElementById(`taskcard-design-section-${taskCard.id}`);
    const commentsSection = document.getElementById(`taskcard-comments-section-${taskCard.id}`);
    if (
      inDetailView ||
      isParent(clickedElement, textCopySection) ||
      isParent(clickedElement, designSection) ||
      isParent(clickedElement, commentsSection)
    ) {
      return;
    }

    dispatch.app.setCurrentTaskDetail(taskCard);
    dispatch.views.setShowTaskDetail(true);
  };

  return (
    <div className="kanban-item">
      <Card
        className="kanban-item-card hover-actions-trigger "
        style={{ cursor: inDetailView ? 'default' : 'pointer', transition: 'all 0.3s ease-out' }}
        onClick={onCardClicked}
      >
        <CardBody
          className={classNames('pr-0 pl-0', {
            'pb-0': !inDetailView && (taskCard.hasTextCopyChanges || taskCard.designEdits || taskComments.length),
          })}
        >
          <div className="ml-2 mr-2 mb-2 d-flex justify-content-between align-items-start">
            <div>
              <Badge className={`badge-soft-primary d-inline-block py-1 mr-1 mb-0`}>{taskCard.taskColumn.name}</Badge>
              {taskCard.designEdits && (
                <Badge className={`badge-soft-success d-inline-block py-1 mr-1 mb-0`}>Design Change</Badge>
              )}
              {taskCard.hasTextCopyChanges && (
                <Badge className={`badge-soft-info d-inline-block py-1 mr-1 mb-0`}>Text Change</Badge>
              )}
            </div>
            <Badge color="soft-dark h-20">#{taskCard.taskNumber}</Badge>
          </div>
          {taskCard.assignedToFullName && (
            <div className="ml-2 mr-2 d-flex align-items-center mb-2">
              <Avatar name={`${taskCard.assignedToFullName}`} size="l" className="mr-2" />
              <p className="mb-0 font-weight-bold">{taskCard.assignedToFullName}</p>
            </div>
          )}
          <CollabCommentRenderer
            className="ml-2 mr-2 mb-0 font-weight-medium text-sans-serif"
            content={taskCard.title}
          />
          <div className="ml-2 mr-2 mt-1 mb-1 kanban-item-footer">
            {!inDetailView && (
              <>
                <div className="text-500">
                  {taskComments.length > 0 && (
                    <span id={`comments-${taskCard.id}`} className="mr-2">
                      <FontAwesomeIcon icon={['far', 'comment-alt']} className="mr-1" />
                      <span>{taskComments.length}</span>
                      <UncontrolledTooltip target={`comments-${taskCard.id}`}>
                        {taskComments.length} Comments
                      </UncontrolledTooltip>
                    </span>
                  )}
                </div>
                <div className="d-flex">
                  {uniqueCommentCreators.map((creator, index) => (
                    <div
                      className={index > 0 ? 'ml-n1 p-0' : 'p-0'}
                      key={index}
                      id={`creator-${creator.id}-${taskCard.id}`}
                    >
                      <Avatar name={creator.fullName} size="l" />
                      <UncontrolledTooltip target={`creator-${creator.id}-${taskCard.id}`}>
                        {creator.fullName}
                      </UncontrolledTooltip>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="ml-2 mr-2 mt-1 mb-1">
            Created by <i>{`${taskCard.creatorFullName}`}</i>
          </div>
          {taskCard.hasTextCopyChanges && !inDetailView && (
            <div
              className="bg-100 p-2 d-flex justify-content-between cursor-default"
              id={`taskcard-text-copy-section-${taskCard.id}`}
            >
              <CopyToClipboard text={taskCard.textCopyChanges} onCopy={onCopyToClipboard}>
                <Button color="link" className="fs--2 pl-0 pr-0">
                  Copy Text
                </Button>
              </CopyToClipboard>
              <Button
                id={`view-text-copy-change-${taskCard.id}`}
                className="fs--2 w-135"
                color={`falcon-${viewingTextCopyChangeForCurrentTask ? 'danger' : 'default'}`}
                size="sm"
                onClick={viewingTextCopyChangeForCurrentTask ? restoreTextCopyChange : viewTextCopyChange}
              >
                {viewingTextCopyChangeForCurrentTask ? 'Dismiss Changes' : 'View Text Changes'}
              </Button>
              {!taskFoundInDom && (
                <UncontrolledTooltip target={`view-text-copy-change-${taskCard.id}`}>
                  Task could not be found on the page.
                </UncontrolledTooltip>
              )}
            </div>
          )}
          {taskCard.designEdits && !inDetailView && (
            <div
              className="bg-100 p-2 d-flex justify-content-between cursor-default"
              id={`taskcard-design-section-${taskCard.id}`}
            >
              <CopyToClipboard text={taskCard.designEdits} onCopy={onCopyToClipboard}>
                <Button color="link" className="fs--2 pl-0 pr-0">
                  Copy Code
                </Button>
              </CopyToClipboard>
              <Button
                id={`view-design-change-${taskCard.id}`}
                className="fs--2 w-135"
                color={`falcon-${viewingDesignChangeForCurrentTask ? 'danger' : 'default'}`}
                size="sm"
                onClick={viewingDesignChangeForCurrentTask ? restoreDesignChange : viewDesignChange}
              >
                {viewingDesignChangeForCurrentTask ? 'Dismiss Changes' : 'View Design Edits'}
              </Button>
              {!taskFoundInDom && (
                <UncontrolledTooltip target={`view-design-change-${taskCard.id}`}>
                  Task could not be found on the page.
                </UncontrolledTooltip>
              )}
            </div>
          )}
          {taskComments.length > 0 && !inDetailView && (
            <div id={`taskcard-comments-section-${taskCard.id}`}>
              <CollapseHeader
                onClick={() => setCollapseOpen(!collapseOpen)}
                isOpen={collapseOpen}
                fontWeight="font-weight-light"
                className="bg-100 pl-2 pr-2"
                classNameChildrenContent="fs--1"
              >
                View Comments
              </CollapseHeader>
              <Collapse isOpen={collapseOpen} className="p-2 cursor-default">
                <TaskCommentsContent task={taskCard} comments={taskComments} />
              </Collapse>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default TaskCard;
