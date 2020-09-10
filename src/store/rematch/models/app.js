import { jsdataStore } from 'src/store/jsdata';

export const app = {
  state: {
    // internal properties
    currentUserId: null,
    fullToolbarVisible: false,

    // properties set from outside info
    parentOrigin: '',
    targetStyle: {},
    targetDomPath: '',
    targetCssText: '',
    targetId: '',
    projectKey: '',
  },
  reducers: {
    setCurrentUserId(state, currentUserId) {
      return { ...state, currentUserId };
    },
    setFullToolbarVisible(state, fullToolbarVisible) {
      return { ...state, fullToolbarVisible };
    },
    setParentOrigin(state, parentOrigin) {
      return { ...state, parentOrigin };
    },
    setTargetData(state, targetState) {
      return { ...state, ...targetState };
    },
    setProjectKey(state, projectKey) {
      return { ...state, projectKey };
    },
  },
  effects: (dispatch) => ({
    async initializeApp(_, rootState) {
      window.addEventListener('message', this.onWindowMessage);
      try {
        const response = await jsdataStore.getMapper('user').fetchCurrentUser();
        dispatch.app.setCurrentUserId(response.data.user.id);
      } catch (e) {
        console.log(e);
        return;
      }
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
          dispatch.app.setFullToolbarVisible(true);
        } else if (message.type === 'projectKey') {
          dispatch.app.setProjectKey(message.projectKey);
        }
      } catch (err) {
        return;
      }
    },
    enterSelectionMode(_, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'enterSelectionMode' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
    },
    enterLoginMode() {
      dispatch.app.showFullToolbar();
    },
    toggleFullToolbar(_, rootState) {
      // REMOVE? NOT EVEN USED?
      rootState.app.fullToolbarVisible ? dispatch.app.hideFullToolbar() : dispatch.app.showFullToolbar();
    },
    showFullToolbar(_, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'showFullToolbar' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setFullToolbarVisible(true);
    },
    hideFullToolbar(_, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'hideFullToolbar' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setFullToolbarVisible(false);
    },
    hideToolbar(_, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'hideToolbar' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setFullToolbarVisible(false);
    },
  }),
};
