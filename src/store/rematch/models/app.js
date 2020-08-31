import { jsdataStore } from 'src/store/jsdata';

export const app = {
  state: {
    currentUserId: null,
    parentOrigin: '',
  },
  reducers: {
    setCurrentUserId(state, currentUserId) {
      return { ...state, currentUserId };
    },
    setParentOrigin(state, parentOrigin) {
      return { ...state, parentOrigin };
    },
  },
  effects: (dispatch) => ({
    async initializeApp(_, rootState) {
      window.addEventListener('message', this.onWindowMessage);
    },
    async destructApp() {
      window.removeEventListener('message', this.onWindowMessage);
    },
    onWindowMessage(e) {
      try {
        const message = JSON.parse(e.data);
        if (message.type !== 'setParentOrigin') {
          return;
        }
        dispatch.app.setParentOrigin(e.origin);
      } catch (err) {
        return;
      }
    },
  }),
};
