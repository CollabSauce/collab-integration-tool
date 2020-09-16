import React, { useState } from 'react';
import uniq from 'lodash/uniq';
import classNames from 'classnames';
import { Button, Card, CardBody, Badge, UncontrolledTooltip, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useStoreState } from 'src/hooks/useStoreState';
import TaskCommentsContent from 'src/components/TaskCommentsContent';
import CollapseHeader from 'src/components/CollapseHeader';
import Avatar from 'src/components/Avatar';

const TaskColumnColorMap = {
  'Raw Task': 'secondary',
  'To-Do': 'primary',
  'In Progress': 'light',
  'In Review': 'info',
  Done: 'warning',
  Released: 'dark',
};

const TaskCard = ({ taskCard, taskDomMap }) => {
  const badgeColor = TaskColumnColorMap[taskCard.taskColumn.name];
  const members = taskCard.taskComments.map((comment) => comment.creator);
  const uniqueMembers = uniq(members);
  const taskFoundInDom = taskDomMap[taskCard.id];

  const [collapseOpen, setCollapseOpen] = useState(false);

  const { result: taskComments } = useStoreState(
    (store) => store.getAll('taskComment').filter((tc) => tc.task.id === taskCard.id),
    [taskCard],
    'taskComment'
  );

  const onCopyToClipboard = () => toast.info('Copied to clipboard!');

  const viewDesignChange = () => {
    if (!taskFoundInDom) {
      return;
    }
    console.log('ehl');
  };

  return (
    <div className="kanban-item">
      <Card
        className="kanban-item-card hover-actions-trigger "
        style={{ cursor: 'pointer', transition: 'all 0.3s ease-out' }}
        onClick={() => {}}
      >
        <CardBody className={classNames('pr-0 pl-0', { 'pb-0': taskCard.designEdits || taskComments.length })}>
          <div className="ml-2 mr-2 mb-2 d-flex justify-content-between">
            <div>
              <Badge className={`badge-soft-${badgeColor} d-inline-block py-1 mr-1 mb-0`}>
                {taskCard.taskColumn.name}
              </Badge>
              {taskCard.designEdits && (
                <Badge className={`badge-soft-success d-inline-block py-1 mr-1 mb-0`}>Design Change</Badge>
              )}
            </div>
            <Badge color="soft-dark">#{taskCard.taskNumber}</Badge>
          </div>
          <div className="ml-2 mr-2 d-flex align-items-center mb-2">
            <Avatar name={`${taskCard.creator.firstName} ${taskCard.creator.lastName}`} size="l" className="mr-2" />
            <p className="mb-0 font-weight-bold">
              {taskCard.creator.firstName} {taskCard.creator.lastName}
            </p>
          </div>
          <p
            className="ml-2 mr-2 mb-0 font-weight-medium text-sans-serif"
            dangerouslySetInnerHTML={{ __html: taskCard.title }}
          />
          <div className="ml-2 mr-2 mt-1 mb-1 kanban-item-footer">
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
            <div>
              {uniqueMembers.map((member, index) => (
                <div className={index > 0 ? 'ml-n1 p-0' : 'p-0'} key={index} id={`member-${member.id}-${taskCard.id}`}>
                  <Avatar name={`${member.firstName} ${member.lastName}`} size="l" />
                  <UncontrolledTooltip target={`member-${member.id}-${taskCard.id}`}>
                    {`${member.firstName} ${member.lastName}`}
                  </UncontrolledTooltip>
                </div>
              ))}
            </div>
          </div>
          {taskCard.designEdits && (
            <div className="bg-100 p-2 d-flex justify-content-between cursor-default">
              <CopyToClipboard text={taskCard.designEdits} onCopy={onCopyToClipboard}>
                <Button color="link" className="fs--2 pl-0 pr-0">
                  Copy Code
                </Button>
              </CopyToClipboard>
              <Button
                id={`view-design-change-${taskCard.id}`}
                className="fs--2"
                color="falcon-default"
                size="sm"
                onClick={viewDesignChange}
              >
                View Design Edits
              </Button>
              {!taskFoundInDom && (
                <UncontrolledTooltip target={`view-design-change-${taskCard.id}`}>
                  Task could not be found on the page.
                </UncontrolledTooltip>
              )}
            </div>
          )}
          {taskComments.length > 0 && (
            <>
              <CollapseHeader
                onClick={() => setCollapseOpen(!collapseOpen)}
                isOpen={collapseOpen}
                fontWeight="font-weight-light"
                className="bg-100 pl-2 pr-2"
                classNameChildrenContent="fs--1"
              >
                View Comments
              </CollapseHeader>
              <Collapse isOpen={collapseOpen} className="p-2">
                <TaskCommentsContent task={taskCard} comments={taskComments} />
              </Collapse>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default TaskCard;
