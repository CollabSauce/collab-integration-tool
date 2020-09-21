import { Schema } from 'js-data';
import { SchemaBase } from './_base';

export const taskCommentSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'taskComments', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    text: { type: 'string' },
    creatorFullName: { type: 'string' },
  },
});

export const taskCommentRelations = {
  belongsTo: {
    user: {
      foreignKey: 'creatorId',
      localField: 'creator',
    },
    task: {
      foreignKey: 'taskId',
      localField: 'task',
    },
  },
};

export const taskCommentActions = {
  // POST /tasks/create_task_comment
  createTaskComment: {
    pathname: 'create_task_comment',
    method: 'POST',
    addResponseToStore: true,
  },
};
