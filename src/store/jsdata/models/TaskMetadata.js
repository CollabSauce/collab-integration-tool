import { Schema } from 'js-data';
import { SchemaBase } from './_base';

export const taskMetadataSchema = new Schema({
  type: 'object',
  track: true,
  plural: 'task_metadatas', // custom property used for deserialization
  properties: {
    ...SchemaBase,
    id: { type: 'number' },
    url_origin: { type: 'string' },
    operating_system: { type: 'string' },
    browser: { type: 'string' },
    selector: { type: 'string' },
    resolution: { type: 'string' },
    browser_window: { type: 'string' },
    color_depth: { type: 'string' },
  },
});

export const taskMetadataRelations = {
  belongsTo: {
    task: {
      foreignKey: 'taskMetadata', // this needs to match the foreignKey field on the user model (ie task.taskMetaData) (other side of a 1-1 model)
      localField: 'task',
    },
  },
};
