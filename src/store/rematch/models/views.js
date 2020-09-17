const InitialState = {
  showLogout: false,
  showFailedLogin: false,
  showTaskCreator: false,
  showTasksSummary: false,
  showTaskDetail: false,
};

export const views = {
  state: { ...InitialState },
  reducers: {
    setShowLogout(_, showLogout) {
      return { ...InitialState, showLogout };
    },
    setShowFailedLogin(_, showFailedLogin) {
      return { ...InitialState, showFailedLogin };
    },
    setShowTaskCreator(_, showTaskCreator) {
      return { ...InitialState, showTaskCreator };
    },
    setShowTasksSummary(_, showTasksSummary) {
      return { ...InitialState, showTasksSummary };
    },
    setShowTaskDetail(_, showTaskDetail) {
      return { ...InitialState, showTaskDetail };
    },
  },
  effects: (dispatch) => ({}),
};
