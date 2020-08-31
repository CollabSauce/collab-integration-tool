import { Schema } from 'js-data';
import { SchemaBase } from './_base';

export const commentSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'comments', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    bodytext: { type: 'string' },
    updated: { type: 'string' },
    created: { type: 'string' },
  },
});

export const commentRelations = {
  belongsTo: {
    user: {
      foreignKey: 'creatorId',
      localField: 'creator',
    },
    thread: {
      foreignKey: 'threadId',
      localField: 'thread',
    },
  },
};
