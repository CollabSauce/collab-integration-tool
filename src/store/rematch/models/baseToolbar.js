const InitialState = {
  viewTasksClicked: false,
  plusButtonClicked: false,
};

// Used when showing the login/no-project-access card. Whether to show the "Continue with feedback" button.
export const baseToolbar = {
  state: { ...InitialState },
  reducers: {
    setViewTasksClicked(_, viewTasksClicked) {
      return { ...InitialState, viewTasksClicked };
    },
    setPlusButtonClicked(_, plusButtonClicked) {
      return { ...InitialState, plusButtonClicked };
    },
  },
  effects: (dispatch) => ({}),
};
