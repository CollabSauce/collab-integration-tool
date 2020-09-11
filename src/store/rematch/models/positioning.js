export const positioning = {
  state: {
    alignRight: true,
    alignLeft: false,
    alignTop: true,
    alignBottom: false,

    sizeFull: true,
    sizeHalf: false,
    sizeQuarter: false,
  },
  reducers: {
    setAlignRight(state) {
      return { ...state, alignRight: true, alignLeft: false };
    },
    setAlignLeft(state) {
      return { ...state, alignRight: false, alignLeft: true };
    },
    setAlignTop(state) {
      return { ...state, alignTop: true, alignBottom: false };
    },
    setAlignBottom(state) {
      return { ...state, alignTop: false, alignBottom: true };
    },
    setSizeFull(state) {
      return { ...state, sizeFull: true, sizeHalf: false, sizeQuarter: false };
    },
    setSizeHalf(state) {
      return { ...state, sizeFull: false, sizeHalf: true, sizeQuarter: false };
    },
    setSizeQuarter(state) {
      return { ...state, sizeFull: false, sizeHalf: false, sizeQuarter: true };
    },
  },
  effects: (dispatch) => ({
    align(alignmentType, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'newAlignment', alignmentType };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);

      dispatch.positioning[`setAlign${alignmentType}`]();
    },
    size(sizeType, rootState) {
      const parentOrigin = rootState.app.parentOrigin;
      const message = { type: 'newSizing', sizeType };
      window.parent.postMessage(JSON.stringify(message), parentOrigin);

      dispatch.positioning[`setSize${sizeType}`]();
    },
  }),
};
