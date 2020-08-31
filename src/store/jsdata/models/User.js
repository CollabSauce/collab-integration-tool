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
  belongsTo: {
    organization: {
      foreignKey: 'organizationId',
      localField: 'organization',
    },
  },
  hasOne: {
    profile: {
      foreignKey: 'profile',
      localField: 'profile',
    },
  },
  hasMany: {
    comment: {
      foreignKey: 'creatorId', // this needs to match the foreignKey field on the comment model (ie comment.creatorId)
      localField: 'comments',
    },
  },
};

// organization

export const userActions = {
  // GET /users/me
  fetchCurrentUser: {
    pathname: 'me',
    method: 'GET',
    addResponseToStore: true,
    params: {
      include: ['memberships.organization.threads.'],
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
