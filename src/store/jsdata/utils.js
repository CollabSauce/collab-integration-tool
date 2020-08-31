import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import snakeCase from 'lodash/snakeCase';

import { getAuthToken, setAuthToken } from 'src/utils/auth';
import { rematchStore } from 'src/store/rematch';

export const getApiHeaders = (config) => {
  const headers = { ...config.headers }; // make a copy. no overwriting.

  headers['Authorization'] = `Token ${getAuthToken()}`;
  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  if (!headers['Accept']) {
    headers['Accept'] = 'application/json';
  }

  return headers;
};

export const serialize = (data) => {
  return toSnakeCase(data);
};

export const deserialize = (response, store, mappers) => {
  response.data = toCamelCase(response.data);
  Object.entries(response.data).forEach(([key, data]) => {
    const formattedKey = key[0] === '+' ? key.slice(1) : key;
    const resourceMapper = mappers[formattedKey];
    if (resourceMapper) {
      const schemaProps = resourceMapper.getSchema().properties;
      // deserialize each individual item
      if (Array.isArray(data)) {
        data.forEach((item) => {
          deserializeIndividualItem(item, resourceMapper, schemaProps);
        });
      } else {
        deserializeIndividualItem(data, resourceMapper, schemaProps);
      }

      // now manually push that data into the store.
      store.add(resourceMapper.name, data);
    }
  });
};

const deserializeIndividualItem = (item, mapper, schemaProps) => {
  // change __isLoaded to true
  item.__isLoaded = true;

  // custom deserialization for relationships
  mapper.relationList.forEach((relation) => {
    if (item[relation.localField]) {
      if (relation.type === 'hasMany') {
        item[relation.localField] = item[relation.localField].map((id: string | number) => ({ id }));
      } else {
        item[relation.localField] = { id: item[relation.localField] };
      }
    }
  });

  // custom deserialization for certain field-types
  Object.keys(schemaProps)
    .filter((key) => schemaProps[key].type === 'number')
    .forEach((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        // for decimals, drf returns decimals as strings. convert to number
        item[key] = parseFloat(value);
      } else if (value === null) {
        // for any number, js-data only takes 'undefined', not 'null'. convert to undefined if applicable
        item[key] = undefined;
      }
    });
};

export const responseError = (err) => {
  // Check if error is an auth error. If so, set the authToken to null.
  // This will then redirect to the login route. (See routes.js for this logic).
  if (err && err.response && err.response.status === 401) {
    // err.response on invalid token:
    //   data: {detail: "Invalid token."}
    //   status: 401
    //   statusText: "Unauthorized"
    setAuthToken();
    // @ts-ignore
    rematchStore.dispatch.app.setCurrentUserId(null);
  }
};

export function iterator(obj, transformer) {
  if (isArray(obj)) {
    return map(obj, (value) => iterator(value, transformer));
  } else if (isObject(obj)) {
    const copy = mapValues(obj, (value) => iterator(value, transformer));

    return mapKeys(copy, (_, key) => transformer(key));
  }

  return obj;
}

export function toSnakeCase(obj) {
  return iterator(obj, snakeCase);
}

export function toCamelCase(obj) {
  return iterator(obj, camelCase);
}
