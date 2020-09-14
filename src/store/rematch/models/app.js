import Bowser from 'bowser';

import { jsdataStore } from 'src/store/jsdata';

export const app = {
  state: {
    // internal properties
    currentUserId: null,
    fullToolbarVisible: false,
    cssCodeChanges: '',
    newTaskTitle: '',
    creatingTask: false,

    // properties set from outside info
    parentOrigin: '', // url origin of the parent window
    targetStyle: {}, // styling of the target, from `getComputedStyle()`
    targetDomPath: '', // dom path (i.e selector) of the target
    targetCssText: '', // if the target has in-element styling, this is the text of that styling
    targetInElementStyling: '', // if the target has in-element styling, this is the json-object form of that styling.
    targetId: '', // id of the target, if applicable
    projectKey: '',
  },
  reducers: {
    setCurrentUserId(state, currentUserId) {
      return { ...state, currentUserId };
    },
    setFullToolbarVisible(state, fullToolbarVisible) {
      return { ...state, fullToolbarVisible };
    },
    setCssCodeChanges(state, cssCodeChanges) {
      return { ...state, cssCodeChanges };
    },
    setNewTaskTitle(state, newTaskTitle) {
      return { ...state, newTaskTitle };
    },
    setCreatingTask(state, creatingTask) {
      return { ...state, creatingTask };
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
          const { targetStyle, targetDomPath, targetCssText, targetInElementStyling, targetId } = message;
          dispatch.app.setTargetData({
            targetStyle,
            targetDomPath,
            targetCssText,
            targetInElementStyling,
            targetId,
          });
          dispatch.app.setFullToolbarVisible(true);
        } else if (message.type === 'projectKey') {
          dispatch.app.setProjectKey(message.projectKey);
        } else if (message.type === 'createTaskWithInfo') {
          dispatch.app.createTaskWithInfo(message);
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
    getInfoFromCommunicatorToCreateTask(_, rootState) {
      dispatch.app.setCreatingTask(true);
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'getInfoForCreateTask' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
    },
    async createTaskWithInfo({ html, width, height, url_origin }, rootState) {
      try {
        const { parsedResult } = Bowser.getParser(window.navigator.userAgent);
        const { browser, os } = parsedResult;

        const task_metadata = {
          url_origin: url_origin,
          os_name: os.name,
          os_version: os.version,
          os_version_name: os.versionName,
          browser_name: browser.name,
          browser_version: browser.version,
          selector: rootState.app.targetDomPath,
          screen_width: window.screen.width, // used to calculate screen resolution
          screen_height: window.screen.height, // used to calculate screen resolution
          device_pixel_ratio: window.devicePixelRatio, // used to calculate screen resolution
          browser_window_width: width,
          browser_window_height: height,
          color_depth: window.screen.colorDepth,
          pixel_depth: window.screen.pixelDepth,
        };
        const currentProject = jsdataStore.getAll('project').find((p) => p.key === rootState.app.projectKey);
        const task = {
          title: rootState.app.newTaskTitle,
          target_dom_path: rootState.app.targetDomPath,
          project: parseInt(currentProject.id),
          design_edits: rootState.app.cssCodeChanges,
        };

        const response = await jsdataStore
          .getMapper('task')
          .createTaskFromWidget({ data: { task, task_metadata, html } });
        debugger;
      } finally {
        dispatch.app.setCreatingTask(false);
      }
    },
  }),
};
