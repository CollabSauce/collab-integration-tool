import React from 'react';
import { Card, CardBody, Badge, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import uniq from 'lodash/uniq';

import Avatar from 'src/components/Avatar';

const TaskColumnColorMap = {
  'Raw Task': 'secondary',
  'To-Do': 'primary',
  'In Progress': 'success',
  'In Review': 'info',
  Done: 'warning',
  Released: 'done',
};

const TaskCard = ({ taskCard }) => {
  const badgeColor = TaskColumnColorMap[taskCard.taskColumn.name];
  const members = taskCard.taskComments.map((comment) => comment.creator);
  const uniqueMembers = uniq(members);
  return (
    <div className="kanban-item">
      <Card
        className="kanban-item-card hover-actions-trigger "
        style={{ cursor: 'pointer', transition: 'all 0.3s ease-out' }}
        onClick={() => {}}
      >
        <CardBody className="pr-2 pl-2">
          <div className="mb-2 d-flex justify-content-between">
            <Badge className={`badge-soft-${badgeColor} d-inline-block py-1 mr-1 mb-0`}>
              {taskCard.taskColumn.name}
            </Badge>
            <Badge color="soft-dark">#{taskCard.taskNumber}</Badge>
          </div>
          <div className="d-flex align-items-center mb-2">
            <Avatar name={`${taskCard.creator.firstName} ${taskCard.creator.lastName}`} size="l" className="mr-2" />
            <p className="mb-0 font-weight-bold">
              {taskCard.creator.firstName} {taskCard.creator.lastName}
            </p>
          </div>
          <p className="mb-0 font-weight-medium text-sans-serif" dangerouslySetInnerHTML={{ __html: taskCard.title }} />
          <div className="kanban-item-footer">
            <div className="text-500">
              {taskCard.taskComments.length > 0 && (
                <span id={`comments-${taskCard.id}`} className="mr-2">
                  <FontAwesomeIcon icon={['far', 'comment-alt']} className="mr-1" />
                  <span>{taskCard.taskComments.length}</span>
                  <UncontrolledTooltip target={`comments-${taskCard.id}`}>Comments</UncontrolledTooltip>
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
        </CardBody>
      </Card>
    </div>
  );
};

export default TaskCard;
