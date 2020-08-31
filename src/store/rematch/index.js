import { init } from '@rematch/core';
import selectPlugin from '@rematch/select';

import { models } from 'src/store/rematch/models';

export const rematchStore = init({
  plugins: [selectPlugin()],
  models,
});
