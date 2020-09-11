import { DataStore, utils } from 'js-data';
import { HttpAdapter, addAction } from 'js-data-http';
// If we want sourcemaps to working properly while debugging, change above line to import from 'js-data-http/src/index';
// If you do that, in that file you need to change line to do: import axios from 'axios'

import { inviteSchema, inviteRelations, inviteActions } from 'src/store/jsdata/models/Invite';
import { membershipSchema, membershipRelations } from 'src/store/jsdata/models/Membership';
import { organizationSchema, organizationRelations } from 'src/store/jsdata/models/Organization';
import { profileSchema, profileRelations } from 'src/store/jsdata/models/Profile';
import { projectSchema, projectRelations } from 'src/store/jsdata/models/Project';
import { taskSchema, taskRelations, taskActions } from 'src/store/jsdata/models/Task';
import { taskColumnSchema, taskColumnRelations } from 'src/store/jsdata/models/TaskColumn';
import { taskCommentSchema, taskCommentRelations, taskCommentActions } from 'src/store/jsdata/models/TaskComment';
import { taskMetadataSchema, taskMetadataRelations } from 'src/store/jsdata/models/TaskMetadata';
import { userSchema, userRelations, userActions } from 'src/store/jsdata/models/User';

import { BASE_PATH, API_PATH } from 'src/constants';
import { getApiHeaders, deserialize, serialize, responseError } from 'src/store/jsdata/utils';

// monkey-patch utils.deepMixIn.
// Changes "else { dest[key] = value; }" to "else if (typeof value !== 'undefined') { dest[key] = value; }".
const deepMixIn = (dest, source) => {
  const isPlainObject = function (value) {
    return !!value && typeof value === 'object' && value.constructor === Object;
  };

  if (source) {
    for (var key in source) {
      const value = source[key];
      const existing = dest[key];
      if (isPlainObject(value) && isPlainObject(existing)) {
        utils.deepMixIn(existing, value);
      } else if (typeof value !== 'undefined') {
        dest[key] = value;
      }
    }
  }
  return dest;
};
utils.deepMixIn = deepMixIn;

const adapter = new HttpAdapter({
  basePath: BASE_PATH + API_PATH,
  beforeHTTP(config, opts) {
    // get headers like `authorization`, `accept`, etc..
    if (!config.noCustomHeaders) {
      config.headers = getApiHeaders(config);
    }

    // Now do the default behavior
    return HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
  },
  beforePUT(url, data, config, opts) {
    // change PUT to PATCH
    config['method'] = 'patch';
  },
  responseError(err, config, opts) {
    // generic response error handling collab-sauce
    responseError(err);

    // Now do the default behavior.
    return HttpAdapter.prototype.responseError.call(this, err, config, opts);
  },
  serialize(mapper, data, opts) {
    const serializedData = serialize(data);
    return HttpAdapter.prototype.serialize.call(this, mapper, serializedData, opts);
  },
  deserialize(mapper, response, opts) {
    const datastore = mapper.datastore;
    deserialize(response, datastore, mappers);

    const key = opts.op === 'findAll' ? mapper.schema.plural : opts.name; // example: `users` or `user`. `taskColumns` or `taskColumn`
    response.data = response.data[key];
    return HttpAdapter.prototype.deserialize.call(this, mapper, response, opts);
  },
});

export const jsdataStore = new DataStore();
jsdataStore.registerAdapter('http', adapter, { default: true });

///////////////////////
/// Register Models ///
///////////////////////
jsdataStore.defineMapper('invite', {
  endpoint: 'invites',
  schema: inviteSchema,
  relations: inviteRelations,
});

jsdataStore.defineMapper('membership', {
  endpoint: 'memberships',
  schema: membershipSchema,
  relations: membershipRelations,
});

jsdataStore.defineMapper('organization', {
  endpoint: 'organizations',
  schema: organizationSchema,
  relations: organizationRelations,
});

jsdataStore.defineMapper('profile', {
  endpoint: 'profiles',
  schema: profileSchema,
  relations: profileRelations,
});

jsdataStore.defineMapper('project', {
  endpoint: 'projects',
  schema: projectSchema,
  relations: projectRelations,
});

jsdataStore.defineMapper('task', {
  endpoint: 'tasks',
  schema: taskSchema,
  relations: taskRelations,
});

jsdataStore.defineMapper('taskColumn', {
  endpoint: 'task_columns',
  schema: taskColumnSchema,
  relations: taskColumnRelations,
});

jsdataStore.defineMapper('taskComment', {
  endpoint: 'task_comments',
  schema: taskCommentSchema,
  relations: taskCommentRelations,
});

jsdataStore.defineMapper('taskMetadata', {
  endpoint: 'task_metadatas',
  schema: taskMetadataSchema,
  relations: taskMetadataRelations,
});

jsdataStore.defineMapper('user', {
  endpoint: 'users',
  schema: userSchema,
  relations: userRelations,
});

///////////////////////////
/// Register custom actions
///////////////////////////

const deserializeResponse = (response) => {
  deserialize(response, jsdataStore, mappers);
  return response;
};

const actionResponseError = (err) => {
  return utils.reject(err);
};

function registerCustomActions(resource, actions) {
  Object.entries(actions).forEach(([actionName, actionConfig]) => {
    const baseConfig = { ...actionConfig, responseError: actionResponseError };
    const config = actionConfig.addResponseToStore ? { ...baseConfig, response: deserializeResponse } : baseConfig;
    const createAction = addAction(actionName, config);
    createAction(jsdataStore.getMapper(resource));
  });
}

registerCustomActions('user', userActions);
registerCustomActions('invite', inviteActions);
registerCustomActions('task', taskActions);
registerCustomActions('taskComment', taskCommentActions);

/////////////////////////////
/// Create Mappers Object ///
/////////////////////////////

// create mappers object for deserialization method
const mappers = {};
Object.entries(jsdataStore._mappers).forEach(([name, mapper]) => {
  mappers[name] = mapper;
  mappers[mapper.schema.plural] = mapper;
});
