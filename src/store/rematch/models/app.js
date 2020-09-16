import Bowser from 'bowser';
import { toast } from 'react-toastify';

import { jsdataStore } from 'src/store/jsdata';

export const app = {
  state: {
    // internal properties
    currentUserId: null,
    fullToolbarVisible: false,
    newTaskTitle: '',
    creatingTask: false,
    taskSuccessfullyCreated: false, // used in css editor when determining whether to restore changes

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
    setNewTaskTitle(state, newTaskTitle) {
      return { ...state, newTaskTitle };
    },
    setCreatingTask(state, creatingTask) {
      return { ...state, creatingTask };
    },
    setTaskSuccessfullyCreated(state, taskSuccessfullyCreated) {
      return { ...state, taskSuccessfullyCreated };
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
    setupMessageListener() {
      window.addEventListener('message', this.onWindowMessage);
    },
    async initializeApp(_, rootState) {
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
          dispatch.views.setShowTaskCreator(true);
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
    enterShowTasksSummaryMode() {
      dispatch.app.showFullToolbar();
      dispatch.views.setShowTasksSummary(true);
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
          design_edits: rootState.styling.cssCodeChanges,
        };

        await jsdataStore.getMapper('task').createTaskFromWidget({ data: { task, task_metadata, html } });
        toast.success('Task created.');
        // Now, when the css exits, it won't try to restore changes. NOTE: this is pretty convoluted, clean this up later.
        dispatch.app.setTaskSuccessfullyCreated(true);
        dispatch.views.setShowTasksSummary(true);
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
      } finally {
        dispatch.app.setCreatingTask(false);
      }
    },
    onExitTaskCreator(_, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'exitTaskCreationMode' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.styling.setCssCodeChanges('');
      dispatch.app.setNewTaskTitle('');
    },
  }),
};
