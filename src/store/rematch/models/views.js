const InitialState = {
  showLogin: false,
  showLogout: false,
  showFailedLogin: false,
  showTaskCreator: false,
  showTaskCreatorEditors: false,
  showTasksSummary: false,
  showTaskDetail: false,
  showNoProjectAccess: false,
};

export const views = {
  state: { ...InitialState },
  reducers: {
    setShowLogin(_, showLogin) {
      return { ...InitialState, showLogin };
    },
    setShowLogout(_, showLogout) {
      return { ...InitialState, showLogout };
    },
    setShowFailedLogin(_, showFailedLogin) {
      return { ...InitialState, showFailedLogin };
    },
    setShowTaskCreator(_, showTaskCreator) {
      // whenever we show/hide the task creator, we show also show/hide the
      // task-creator-editors (i.e css-editor and text-copy-editor)
      return { ...InitialState, showTaskCreator, showTaskCreatorEditors: showTaskCreator };
    },
    setShowTaskCreatorEditors(state, showTaskCreatorEditors) {
      // Don't return initial state, as we still want `showTaskCreator` to be true
      return { ...state, showTaskCreatorEditors };
    },
    setShowTasksSummary(_, showTasksSummary) {
      return { ...InitialState, showTasksSummary };
    },
    setShowTaskDetail(state, showTaskDetail) {
      // Don't return initial state, as we still want `showTasksSummary` to be true
      return { ...state, showTaskDetail };
    },
    setShowNoProjectAccess(state, showNoProjectAccess) {
      return { ...InitialState, showNoProjectAccess };
    },
    hideTaskCreator(state) {
      return { ...state, showTaskCreator: false };
    },
  },
  effects: (dispatch) => ({}),
};
