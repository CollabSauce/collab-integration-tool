import { Schema } from 'js-data';
import { SchemaBase } from './_base';

export const taskSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'tasks', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    title: { type: 'string' },
    created: { type: 'string' },
    description: { type: 'string' },
    designEdits: { type: 'string' },
    windowScreenshotUrl: { type: 'string' },
    elementScreenshotUrl: { type: 'string' },
    taskNumber: { type: 'number' },
    isResolved: { type: 'boolean' },
    targetId: { type: 'string' },
    targetDomPath: { type: 'string' },
    order: { type: 'number' },
  },
});

export const taskRelations = {
  hasOne: {
    taskMetadata: {
      foreignKey: 'taskMetadata',
      localField: 'taskMetadata',
    },
  },
  belongsTo: {
    user: {
      foreignKey: 'creatorId',
      localField: 'creator',
    },
    project: {
      foreignKey: 'projectId',
      localField: 'project',
    },
    taskColumn: {
      foreignKey: 'taskColumnId',
      localField: 'taskColumn',
    },
  },
  hasMany: {
    taskComment: {
      foreignKey: 'taskId', // this needs to match the foreignKey field on the taskComment model (ie taskComment.taskId)
      localField: 'taskComments',
    },
  },
};

export const taskActions = {
  // POST /tasks/reorder_tasks
  reorderTasks: {
    pathname: 'reorder_tasks',
    method: 'POST',
    addResponseToStore: true,
  },
  createTask: {
    pathname: 'create_task',
    method: 'POST',
    addResponseToStore: true,
  },
  createTaskFromWidget: {
    pathname: 'create_task_from_widget',
    method: 'POST',
    addResponseToStore: true, // switch to false probably?
  },
};
