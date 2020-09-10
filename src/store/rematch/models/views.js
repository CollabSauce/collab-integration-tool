export const views = {
  state: {
    showLogout: false,
    showFailedLogin: false,
  },
  reducers: {
    setShowLogout(state, showLogout) {
      return { ...state, showLogout };
    },
    setShowFailedLogin(state, showFailedLogin) {
      return { ...state, showFailedLogin };
    },
  },
  effects: (dispatch) => ({}),
};
