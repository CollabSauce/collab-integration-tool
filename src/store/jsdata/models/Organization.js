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
    invite: {
      foreignKey: 'organizationId', // this needs to match the foreignKey field on the invite model (ie invite.organizationId)
      localField: 'invites',
    },
    membership: {
      foreignKey: 'organizationId', // this needs to match the foreignKey field on the membership model (ie membership.organizationId)
      localField: 'memberships',
    },
    project: {
      foreignKey: 'organizationId', // this needs to match the foreignKey field on the project model (ie project.organizationId)
      localField: 'projects',
    },
  },
};
