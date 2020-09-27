import { Schema } from 'js-data/src/index.js';
import { SchemaBase } from './_base';

import { BASE_PATH } from 'src/constants';

export const userSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'users', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    emailVerified: { type: 'boolean' },
  },
});

export const userRelations = {
  hasOne: {
    profile: {
      foreignKey: 'profile',
      localField: 'profile',
    },
  },
  hasMany: {
    invite: {
      foreignKey: 'inviterId', // this needs to match the foreignKey field on the invite model (ie invite.inviterId)
      localField: 'invitesSent',
    },
    membership: {
      foreignKey: 'userId', // this needs to match the foreignKey field on the membership model (ie membership.inviterId)
      localField: 'memberships',
    },
    task: [
      {
        foreignKey: 'creatorId', // this needs to match the foreignKey field on the task model (ie task.creatorId)
        localField: 'createdTasks',
      },
      {
        foreignKey: 'assignedToId', // this needs to match the foreignKey field on the task model (ie task.assignedToId)
        localField: 'assignedTasks',
      },
    ],
    taskComment: {
      foreignKey: 'creatorId', // this needs to match the foreignKey field on the taskComment model (ie taskComment.creatorId)
      localField: 'createdTaskComments',
    },
  },
};

export const userActions = {
  // GET /users/me
  fetchCurrentUser: {
    pathname: 'me',
    method: 'GET',
    addResponseToStore: true,
    params: {
      include: ['memberships.organization.projects.'],
    },
  },
  // POST /rest-auth/login/
  loginUser: {
    pathname: '/rest-auth/login/',
    endpoint: '/',
    method: 'POST',
    basePath: BASE_PATH, // don't add API_PATH
    noCustomHeaders: true,
  },
  // POST /rest-auth/registration/
  signupUser: {
    pathname: '/rest-auth/registration/',
    endpoint: '/',
    method: 'POST',
    basePath: BASE_PATH, // don't add API_PATH
    noCustomHeaders: true,
  },
  // POST /rest-auth/password/reset/
  resetPassword: {
    pathname: '/rest-auth/password/reset/',
    endpoint: '/',
    method: 'POST',
    basePath: BASE_PATH, // don't add API_PATH
    noCustomHeaders: true,
  },
  // POST /rest-auth/password/reset/confirm/
  resetPasswordConfirm: {
    pathname: '/rest-auth/password/reset/confirm/',
    endpoint: '/',
    method: 'POST',
    basePath: BASE_PATH, // don't add API_PATH
    noCustomHeaders: true,
  },
};
