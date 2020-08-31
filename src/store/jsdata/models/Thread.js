import { Schema } from 'js-data';
import { SchemaBase } from './_base';

export const threadSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'threads', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    target_id: { type: 'string' },
    target_dom_path: { type: 'string' },
  },
});

export const threadRelations = {
  belongsTo: {
    organization: {
      foreignKey: 'threadId',
      localField: 'thread',
    },
  },
  hasMany: {
    comment: {
      foreignKey: 'threadId', // this needs to match the foreignKey field on the comment model (ie comment.threadId)
      localField: 'comments',
    },
  },
};
