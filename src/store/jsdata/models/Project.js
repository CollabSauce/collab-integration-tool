import { Schema } from 'js-data/src/index.js';
import { SchemaBase } from './_base';

export const projectSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'projects', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    name: { type: 'string' },
    key: { type: 'string' },
    url: { type: 'string' },
  },
});

export const projectRelations = {
  belongsTo: {
    organization: {
      foreignKey: 'organizationId',
      localField: 'organization',
    },
  },
  hasMany: {
    task: {
      foreignKey: 'projectId', // this needs to match the foreignKey field on the task model (ie task.projectId)
      localField: 'tasks',
    },
    taskColumn: {
      foreignKey: 'projectId', // this needs to match the foreignKey field on the task model (ie taskColumn.projectId)
      localField: 'taskColumns',
    },
  },
};

export const projectActions = {
  // GET /projects/retrieve_project_key
  retrieveProjectKey: {
    pathname: 'retrieve_project_key',
    method: 'GET',
  },
};
