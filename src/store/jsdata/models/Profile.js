import { Schema } from 'js-data/src/index.js';
import { SchemaBase } from './_base';

export const profileSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'profiles', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
  },
});

export const profileRelations = {
  belongsTo: {
    user: {
      foreignKey: 'profile', // this needs to match the foreignKey field on the user model (ie user.profile) (other side of a 1-1 model)
      localField: 'user',
    },
  },
};
