const InitialState = {
  showLogin: false,
  showLogout: false,
  showFailedLogin: false,
  showTaskCreator: false,
  showCssEditor: false,
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
      // whenever we show/hide the task creator, we show also show/hide the css-editor
      return { ...InitialState, showTaskCreator, showCssEditor: showTaskCreator };
    },
    setShowCssEditor(state, showCssEditor) {
      // Don't return initial state, as we still want `showTaskCreator` to be true
      return { ...state, showCssEditor };
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
  },
  effects: (dispatch) => ({}),
};
