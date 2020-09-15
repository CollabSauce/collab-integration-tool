import React from 'react';
import { Card, CardBody, Badge, UncontrolledTooltip } from 'reactstrap';
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
        <CardBody>
          <div className="mb-2">
            <Badge className={`badge-soft-${badgeColor} d-inline-block py-1 mr-1 mb-1`}>
              {taskCard.taskColumn.name}
            </Badge>
          </div>
          <p className="mb-0 font-weight-medium text-sans-serif" dangerouslySetInnerHTML={{ __html: taskCard.title }} />
          <div className="kanban-item-footer">
            <div className="text-500" />
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
