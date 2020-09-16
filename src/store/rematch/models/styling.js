export const styling = {
  state: {
    adjustableStyleProps: null,
    hasDesignChanges: false,
    cssCodeChanges: '',
    originalStyleAttributes: [],
  },
  reducers: {
    setAdjustableStyleProps(state, adjustableStyleProps) {
      return { ...state, adjustableStyleProps };
    },
    setHasDesignChanges(state, hasDesignChanges) {
      return { ...state, hasDesignChanges };
    },
    setCssCodeChanges(state, cssCodeChanges) {
      return { ...state, cssCodeChanges };
    },
    addOriginalStyleAttribute(state, additionalElementStyleAttributes) {
      return {
        ...state,
        originalStyleAttributes: [...state.originalStyleAttributes, additionalElementStyleAttributes],
      };
    },
  },
  effects: (dispatch) => ({
    findStyleAttributeForElement(_, rootState) {
      const { originalStyleAttributes } = rootState.styling;
      const { targetId, targetDomPath } = rootState.app;

      // First try to find it by the id of the element. If that doesn't exist find it by the DOM path.
      let originalAttribute = targetId ? originalStyleAttributes.find((attrData) => attrData.id === targetId) : null;
      return originalAttribute
        ? originalAttribute
        : originalStyleAttributes.find((attrData) => attrData.domPath === targetDomPath);
    },
    restoreChanges(_, rootState) {
      const styleAttributeDataForElement = dispatch.styling.findStyleAttributeForElement();
      const { originalCssText, originalStyleData } = styleAttributeDataForElement;
      const message = { type: 'restoreChanges', originalCssText };
      window.parent.postMessage(JSON.stringify(message), rootState.app.parentOrigin);
      dispatch.styling.setAdjustableStyleProps(originalStyleData);
      dispatch.styling.setHasDesignChanges(false);
      dispatch.styling.setCssCodeChanges('');
    },
  }),
};
