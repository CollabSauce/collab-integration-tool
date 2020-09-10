import { Schema } from 'js-data/src/index.js';
import { SchemaBase } from './_base';

export const membershipSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'memberships', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    role: { type: 'number' },
  },
});

export const membershipRelations = {
  belongsTo: {
    user: {
      foreignKey: 'userId',
      localField: 'user',
    },
    organization: {
      foreignKey: 'organizationId',
      localField: 'organization',
    },
  },
};

export const MemberRoleTypes = {
  ADMIN: 1,
  DASHBOARD: 2,
  WIDGET: 3,
};

export const formatRole = (role) => {
  if (role === MemberRoleTypes.ADMIN) {
    return 'Admin';
  } else if (role === MemberRoleTypes.DASHBOARD) {
    return 'Dashboard';
  } else if (role === MemberRoleTypes.WIDGET) {
    return 'Widget';
  } else {
    return 'Unknown';
  }
};
