export const views = {
  state: {
    showLogout: false,
  },
  reducers: {
    setShowLogout(state, showLogout) {
      return { ...state, showLogout };
    },
  },
  effects: (dispatch) => ({}),
};
