import Bowser from 'bowser';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';

import { jsdataStore } from 'src/store/jsdata';
import { handleNetworkError } from 'src/utils/error';
import { INVITE_MEMBERS_VALUE_SELECT } from 'src/constants';

export const app = {
  state: {
    // internal properties
    currentUserId: null,
    fullToolbarVisible: false,
    newTaskTitle: '',
    creatingTask: false,
    taskSuccessfullyCreated: false, // used in css editor when determining whether to restore changes
    textCopyChangeViewingTask: null, // current task viewing changes in client dom
    designChangeViewingTask: null, // current task viewing changes in client dom
    currentTaskDetail: null, // detail-view task
    gridlinesVisible: false, // whether gridlines are visible on the page
    webPaintVisible: false, // whether the web-painter is visible on the page

    // used for task-creator
    createTaskAssigneeValue: null,
    createTaskEmailValue: '',

    // properties set from outside info
    parentOrigin: '', // url origin of the parent window
    targetStyle: {}, // styling of the target, from `getComputedStyle()`
    targetDomPath: '', // dom path (i.e selector) of the target
    targetCssText: '', // if the target has in-element styling, this is the text of that styling
    targetInElementStyling: '', // if the target has in-element styling, this is the json-object form of that styling.
    targetId: '', // id of the target, if applicable
    targetInnerHTML: '', // the original innerHTML of the target
    targetInnerText: '', // the original innerText of the target
    targetInnerTextUpdated: '', // the updated innerText of the target
    projectKey: '',
    isChromeExtension: false,
    taskDomMap: {},
    fetchDomMapIntervalId: null,
    // when in viewing mode, the user clicks "view design change",this is the css before design changes are applied
    selectedTaskCssText: '',
    // when in viewing mode, the user clicks "view text-copy change",this is the inner-html before text changes are applied
    selectedTaskInnerHtml: '',
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
    setTargetInnerTextUpdated(state, targetInnerTextUpdated) {
      return { ...state, targetInnerTextUpdated };
    },
    setProjectKey(state, projectKey) {
      return { ...state, projectKey };
    },
    setIsChromeExtension(state, isChromeExtension) {
      return { ...state, isChromeExtension };
    },
    setTaskDomMap(state, taskDomMap) {
      return { ...state, taskDomMap };
    },
    setFetchDomMapIntervalId(state, fetchDomMapIntervalId) {
      return { ...state, fetchDomMapIntervalId };
    },
    setSelectedTaskCssText(state, selectedTaskCssText) {
      return { ...state, selectedTaskCssText };
    },
    setSelectedTaskInnerHtml(state, selectedTaskInnerHtml) {
      return { ...state, selectedTaskInnerHtml };
    },
    setDesignChangeViewingTask(state, designChangeViewingTask) {
      return { ...state, designChangeViewingTask };
    },
    setTextCopyChangeViewingTask(state, textCopyChangeViewingTask) {
      return { ...state, textCopyChangeViewingTask };
    },
    setCurrentTaskDetail(state, currentTaskDetail) {
      return { ...state, currentTaskDetail };
    },
    setGridlinesVisible(state, gridlinesVisible) {
      return { ...state, gridlinesVisible };
    },
    setWebPaintVisible(state, webPaintVisible) {
      return { ...state, webPaintVisible };
    },
    setCreateTaskAssigneeValue(state, createTaskAssigneeValue) {
      return { ...state, createTaskAssigneeValue };
    },
    setCreateTaskEmailValue(state, createTaskEmailValue) {
      return { ...state, createTaskEmailValue };
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

        // also, load all memberships that user has access to
        jsdataStore.findAll('membership', { include: ['user.'] }, { force: true });
      } catch (err) {
        Sentry.captureException(err);
        console.log(err);
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
          const {
            targetStyle,
            targetDomPath,
            targetCssText,
            targetInElementStyling,
            targetId,
            targetInnerHTML,
            targetInnerText,
          } = message;
          dispatch.app.setTargetData({
            targetStyle,
            targetDomPath,
            targetCssText,
            targetInElementStyling,
            targetId,
            targetInnerHTML,
            targetInnerText,
            targetInnerTextUpdated: targetInnerText,
          });
          dispatch.views.setShowTaskCreator(true);
          dispatch.app.setFullToolbarVisible(true);
        } else if (message.type === 'projectKey') {
          dispatch.app.setProjectKey(message.projectKey);
        } else if (message.type === 'isChromeExtension') {
          dispatch.app.handleChromeExtensionOnInit();
        } else if (message.type === 'createTaskWithInfo') {
          dispatch.app.createTaskWithInfo(message);
        } else if (message.type === 'taskDomMap') {
          dispatch.app.setTaskDomMap(message.taskDomMap);
        } else if (message.type === 'selectedDomItemCssText') {
          dispatch.app.setSelectedTaskCssText(message.originalDomItemCssText);
        } else if (message.type === 'selectedDomItemInnerHtml') {
          dispatch.app.setSelectedTaskInnerHtml(message.originalDomItemInnerHtml);
        } else if (message.type === 'createTaskFailNoElement') {
          dispatch.app.setCreatingTask(false);
          toast.error('Element no longer found on the page - cannot create task.');
        }
      } catch (err) {
        Sentry.captureException(err);
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
      dispatch.views.setShowLogin(true);
    },
    enterShowTasksSummaryMode() {
      dispatch.app.showFullToolbar();
      dispatch.views.setShowTasksSummary(true);
    },
    enterNoProjectAccessMode() {
      dispatch.app.showFullToolbar();
      dispatch.views.setShowNoProjectAccess(true);
    },
    showFullToolbar(_, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'showFullToolbar' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setFullToolbarVisible(true);
    },
    hideFullToolbar(_, rootState) {
      if (rootState.app.webPaintVisible) {
        dispatch.app.toggleWebPaint(); // turn webpaint off if applicable
      }
      if (rootState.views.showTaskCreator) {
        dispatch.views.hideTaskCreator(); // hide task creator if applicable
      }

      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'hideFullToolbar' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setFullToolbarVisible(false);
    },
    hideToolbar(_, rootState) {
      if (rootState.app.webPaintVisible) {
        dispatch.app.toggleWebPaint(); // turn webpaint off if applicable
      }

      if (rootState.app.gridlinesVisible) {
        dispatch.app.toggleGridlines(); // turn gridilens off if applicable
      }

      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'hideToolbar' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setFullToolbarVisible(false);
    },
    getInfoFromCommunicatorToCreateTask(_, rootState) {
      dispatch.app.setCreatingTask(true);
      const parentOrigin = rootState.app.parentOrigin;
      // `showTaskCreatorEditors` will be false if we are in paint mode with no click target. So if `showTaskCreatorEditors`
      // is true, then there should be a click target. If that's the case, tell the parent window that click-target is required.
      const clickTargetRequired = rootState.views.showTaskCreatorEditors;
      const message = { type: 'getInfoForCreateTask', clickTargetRequired };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
    },
    async createTaskWithInfo({ width, height, url_origin, ...rest }, rootState) {
      try {
        const { parsedResult } = Bowser.getParser(window.navigator.userAgent);
        const { browser, os } = parsedResult;

        const hasTextCopyChanges = rootState.app.targetInnerText !== rootState.app.targetInnerTextUpdated;

        const task_metadata = {
          url_origin: url_origin,
          os_name: os.name,
          os_version: os.version,
          os_version_name: os.versionName || '',
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
          target_id: rootState.app.targetId,
          has_target: rootState.views.showTaskCreatorEditors, // if this is false, then we are in "paint only" mode, and there is no "target"
          project: currentProject ? parseInt(currentProject.id) : null,
          project_key: currentProject ? null : rootState.app.projectKey,
          design_edits: rootState.styling.cssCodeChanges,
          text_copy_changes: hasTextCopyChanges ? rootState.app.targetInnerTextUpdated : '',
          has_text_copy_changes: hasTextCopyChanges,
          assigned_to:
            rootState.app.createTaskAssigneeValue &&
            rootState.app.createTaskAssigneeValue.value !== INVITE_MEMBERS_VALUE_SELECT
              ? rootState.app.createTaskAssigneeValue.value
              : null,
          one_off_email_set_by: rootState.app.createTaskEmailValue,
        };

        const isAuthenticated = rootState.app.currentUserId;
        const hasAccessToProject = !!currentProject;
        const actionMethod =
          isAuthenticated && hasAccessToProject ? 'createTaskFromWidget' : 'createTaskFromWidgetAnonymous';
        const baseData = { task, task_metadata };
        const contextSpecificData = rootState.app.isChromeExtension
          ? { data_url: rest.dataURL, element_data_url: rest.elementDataURL }
          : { html: rest.html };
        const data = { ...baseData, ...contextSpecificData };
        await jsdataStore.getMapper('task')[actionMethod]({ data });
        let toastMessage = '',
          toastOptions = {};
        if (isAuthenticated && hasAccessToProject) {
          toastMessage = 'Task created.';
        } else {
          toastMessage = 'Sent!';
          toastOptions = { closeButton: false };
        }
        toast.success(toastMessage, toastOptions);
        // Now, when the css exits, it won't try to restore changes. NOTE: this is pretty convoluted, clean this up later.
        dispatch.app.setTaskSuccessfullyCreated(true);
        if (isAuthenticated && hasAccessToProject) {
          dispatch.views.setShowTasksSummary(true);
        } else {
          dispatch.app.hideFullToolbar();
        }
      } catch (err) {
        Sentry.captureException(err);
        toast.error(handleNetworkError(err));
      } finally {
        dispatch.app.setCreatingTask(false);
      }
    },
    onExitTaskCreator(_, rootState) {
      if (rootState.app.webPaintVisible) {
        dispatch.app.toggleWebPaint(); // turn webpaint off when leaving selection mode
      }

      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'exitTaskCreationMode' };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.styling.setCssCodeChanges('');
      dispatch.app.setNewTaskTitle('');
    },
    fetchTaskDomMap(tasks, rootState) {
      // periodically fetch the dom-map. We do this periodically to account
      // for any dynamic webpages  - urls changing in spas, elements being added/remove, etc.
      const fetchTasksFromDom = () => {
        const taskDomData = tasks.map((task) => ({
          id: task.id,
          targetId: task.targetId,
          targetDomPath: task.targetDomPath,
        }));
        const parentOrigin = rootState.app.parentOrigin;
        const message = { type: 'fetchTaskDomMap', taskDomData };
        window.parent.postMessage(JSON.stringify(message), parentOrigin);
      };

      // clear any previous setIntervals for this function
      dispatch.app.clearFetchDomMapInterval();

      // immediate call the function. And then call it again later during the setInterval
      fetchTasksFromDom();
      const intervalId = setInterval(fetchTasksFromDom, 5000);

      // save the intervalId for later - when we want to clear the interval
      dispatch.app.setFetchDomMapIntervalId(intervalId);
    },
    clearFetchDomMapInterval(_, rootState) {
      if (rootState.app.fetchDomMapIntervalId) {
        clearInterval(rootState.app.fetchDomMapIntervalId);
      }
      dispatch.app.setFetchDomMapIntervalId(null);
    },
    viewDesignChange(task, rootState) {
      // for restore any current applied design change, if applicable
      dispatch.app.restoreDesignChange();

      // now apply the new design change
      const domItemData = {
        targetId: task.targetId,
        targetDomPath: task.targetDomPath,
        designEdits: task.designEdits,
      };
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'viewDesignChange', domItemData };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setDesignChangeViewingTask(task);
    },
    restoreDesignChange(messageType = 'restoreDesignChange', rootState) {
      const task = rootState.app.designChangeViewingTask;
      if (!task) {
        return;
      }
      const domItemData = {
        targetId: task.targetId,
        targetDomPath: task.targetDomPath,
        originalCssText: rootState.app.selectedTaskCssText,
        textCopyChangesStillApplied: !!rootState.app.textCopyChangeViewingTask,
      };
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: messageType, domItemData };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setDesignChangeViewingTask(null);
      dispatch.app.setSelectedTaskCssText('');
    },
    restoreDesignChangeIfApplicable(_, rootState) {
      // We don't want to restore the design change if
      //   1) an element has a design change applied, and
      //   2) we are entering the task-detail view. If that's the case, leave everything the same.

      // In all other cases, do restoreDesignChange()
      const currentAppliedDesignChangeTask = rootState.app.designChangeViewingTask;
      const taskDetail = rootState.app.currentTaskDetail;
      if (!taskDetail) {
        dispatch.app.restoreDesignChange();
      } else if (currentAppliedDesignChangeTask && taskDetail && currentAppliedDesignChangeTask.id !== taskDetail.id) {
        dispatch.app.restoreDesignChange();
      }
    },
    selectTaskOnDom(task, rootState) {
      // data to select in dom
      const domItemData = {
        targetId: task.targetId,
        targetDomPath: task.targetDomPath,
      };
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'selectTaskOnDom', domItemData };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
    },
    unselectTaskOnDom(_, rootState) {
      const { currentTaskDetail, taskDomMap } = rootState.app;
      if (!currentTaskDetail || !taskDomMap[currentTaskDetail.id]) {
        // if task doesn't exist on dom, nothing to deselect
        return;
      }
      const domItemData = {
        targetId: currentTaskDetail.targetId,
        targetDomPath: currentTaskDetail.targetDomPath,
      };
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'unselectTaskOnDom', domItemData };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
    },
    restoreDesignChangeKeepSelected(_, rootState) {
      dispatch.app.restoreDesignChange('restoreDesignChangeKeepSelected');
    },
    toggleGridlines(_, rootState) {
      // set internal state
      const showGridlines = !rootState.app.gridlinesVisible;
      dispatch.app.setGridlinesVisible(showGridlines);

      // send info to widget
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'toggleGridlines', showGridlines };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
    },
    toggleWebPaint(_, rootState) {
      // set internal state for webpainter
      const showWebPaint = !rootState.app.webPaintVisible;
      dispatch.app.setWebPaintVisible(showWebPaint);

      // send info to widget
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'toggleWebPaint', showWebPaint };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);

      // If we are turning on paint, and if showTaskCreator is false,
      // then the paint-button was just clicked from a non task-creator view.
      // Therefore we should show the task creator.
      if (showWebPaint && !rootState.views.showTaskCreator) {
        dispatch.app.showFullToolbar();
        // We specifically DO NOT want to show the task creators (text-editor or design-editor).
        // This is because when toggling paint in this mode, no element is selected.
        dispatch.views.setShowTaskCreator(true);
        dispatch.views.setShowTaskCreatorEditors(false);
      }
    },
    restoreTextCopyChangesFromEditor(_, rootState) {
      const message = { type: 'restoreTextCopyEditChanges', originalTextHtml: rootState.app.targetInnerHTML };
      window.parent.postMessage(JSON.stringify(message), rootState.app.parentOrigin);
      dispatch.app.setTargetInnerTextUpdated(rootState.app.targetInnerText);
    },
    viewTextCopyChange(task, rootState) {
      // for restore any current applied text-copy change, if applicable
      dispatch.app.restoreTextCopyChange();

      // now apply the new design change
      const domItemData = {
        targetId: task.targetId,
        targetDomPath: task.targetDomPath,
        textCopyChanges: task.textCopyChanges,
      };
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'viewTextCopyChange', domItemData };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setTextCopyChangeViewingTask(task);
    },
    restoreTextCopyChange(messageType = 'restoreTextCopyChange', rootState) {
      const task = rootState.app.textCopyChangeViewingTask;
      if (!task) {
        return;
      }
      const domItemData = {
        targetId: task.targetId,
        targetDomPath: task.targetDomPath,
        originalInnerHtml: rootState.app.selectedTaskInnerHtml,
        designChangesStillApplied: !!rootState.app.designChangeViewingTask,
      };
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: messageType, domItemData };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);
      dispatch.app.setTextCopyChangeViewingTask(null);
      dispatch.app.setSelectedTaskInnerHtml('');
    },
    restoreTextCopyChangeKeepSelected(_, rootState) {
      dispatch.app.restoreTextCopyChange('restoreTextCopyChangeKeepSelected');
    },
    restoreTextCopyChangeIfApplicable(_, rootState) {
      // We don't want to restore the text change if
      //   1) an element has a text change applied, and
      //   2) we are entering the task-detail view. If that's the case, leave everything the same.

      // In all other cases, do restoreTextChange()
      const currentAppliedTextCopyChangeTask = rootState.app.textCopyChangeViewingTask;
      const taskDetail = rootState.app.currentTaskDetail;
      if (!taskDetail) {
        dispatch.app.restoreTextCopyChange();
      } else if (
        currentAppliedTextCopyChangeTask &&
        taskDetail &&
        currentAppliedTextCopyChangeTask.id !== taskDetail.id
      ) {
        dispatch.app.restoreTextCopyChange();
      }
    },
    async handleChromeExtensionOnInit(_, rootState) {
      dispatch.app.setIsChromeExtension(true);
      const response = await jsdataStore.getMapper('project').retrieveProjectKey({
        params: { parent_origin: rootState.app.parentOrigin },
      });
      if (response.data.project_key) {
        dispatch.app.setProjectKey(response.data.project_key);
      }
    },
  }),
};
