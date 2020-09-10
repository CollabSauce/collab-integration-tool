import { Schema } from 'js-data';
import { SchemaBase } from './_base';

export const taskColumnSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'taskColumns', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    name: { type: 'string' },
  },
});

export const taskColumnRelations = {
  hasMany: {
    task: {
      foreignKey: 'taskColumnId', // this needs to match the foreignKey field on the task model (ie task.columnId)
      localField: 'tasks',
    },
  },
  belongsTo: {
    project: {
      foreignKey: 'projectId',
      localField: 'project',
    },
  },
};
