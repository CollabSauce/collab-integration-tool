export const alignment = {
  state: {
    alignRight: true,
    alignLeft: false,
    alignDown: false,
  },
  reducers: {
    setAlignRight(state) {
      return { alignRight: true, alignLeft: false, alignDown: false };
    },
    setAlignLeft(state) {
      return { alignRight: false, alignLeft: true, alignDown: false };
    },
    setAlignDown(state) {
      return { alignRight: false, alignLeft: false, alignDown: true };
    },
  },
  effects: (dispatch) => ({
    align(alignmentType, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'newAlignment', alignmentType };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);

      dispatch.alignment[`setAlign${alignmentType}`]();
    },
  }),
};
