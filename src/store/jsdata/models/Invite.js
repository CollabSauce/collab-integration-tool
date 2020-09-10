import { Schema } from 'js-data/src/index.js';
import { SchemaBase } from './_base';

export const inviteSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'invites', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    email: { type: 'string' },
    key: { type: 'string' },
    state: { type: 'number' },
  },
});

export const inviteRelations = {
  belongsTo: {
    user: {
      foreignKey: 'inviterId',
      localField: 'inviter',
    },
    organization: {
      foreignKey: 'organizationId',
      localField: 'organization',
    },
  },
};

export const inviteActions = {
  // POST /invites/create_invite
  createInvite: {
    pathname: 'create_invite',
    method: 'POST',
    addResponseToStore: true,
  },
  // POST /invites/accept_invite
  acceptInvite: {
    pathname: 'accept_invite',
    method: 'POST',
    addResponseToStore: true,
  },
  // POST /invites/cancel_invite
  cancelInvite: {
    pathname: 'cancel_invite',
    method: 'POST',
    addResponseToStore: true,
  },
};

export const InviteStates = {
  CREATED: 1,
  ACCEPTED: 2,
  DENIED: 3,
  CANCELED: 4,
};
