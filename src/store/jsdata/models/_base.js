export const SchemaBase = {
  // add this to every property. when loading data from the api, set each item to true.
  // this will help us distinguish between items loaded items and items that are not
  // loaded, but just the ID is loaded (for a relationship).
  __isLoaded: { type: 'boolean' },
};
