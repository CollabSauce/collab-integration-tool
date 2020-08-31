import { Schema } from 'js-data/src/index.js';
import { SchemaBase } from './_base';

export const organizationSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'organizations', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    name: { type: 'string' },
  },
});

export const organizationRelations = {
  hasMany: {
    thread: {
      foreignKey: 'organizationId', // this needs to match the foreignKey field on the thread model (ie thread.organizationId)
      localField: 'threads',
    },
    user: {
      foreignKey: 'organizationId', // this needs to match the foreignKey field on the user model (ie user.organizationId)
      localField: 'users',
    },
  },
};
