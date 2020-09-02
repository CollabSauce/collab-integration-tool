// import { jsdataStore } from 'src/store/jsdata';

export const app = {
  state: {
    currentUserId: null,
    parentOrigin: '',
    targetStyle: {},
    targetDomPath: '',
    targetCssText: '',
    targetId: '',
  },
  reducers: {
    setCurrentUserId(state, currentUserId) {
      return { ...state, currentUserId };
    },
    setParentOrigin(state, parentOrigin) {
      return { ...state, parentOrigin };
    },
    setTargetData(state, targetState) {
      return { ...state, ...targetState };
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
        if (message.type === 'setParentOrigin') {
          dispatch.app.setParentOrigin(e.origin);
        } else if (message.type === 'newClickedTarget') {
          const { targetStyle, targetDomPath, targetCssText, targetId } = message;
          dispatch.app.setTargetData({ targetStyle, targetDomPath, targetCssText, targetId });
        }
      } catch (err) {
        return;
      }
    },
  }),
};
