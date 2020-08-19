export const WIDGET_TYPES = {
  SELECT: 'select',
  COLOR: 'color',
  SLIDER: 'slider'
};

export const BORDER_STYLE_OPTIONS = [
  {value: 'dotted', label: 'dotted'},
  {value: 'dashed', label: 'dashed'},
  {value: 'solid', label: 'solid'},
  {value: 'double', label: 'double'},
  {value: 'groove', label: 'groove'},
  {value: 'ridge', label: 'ridge'},
  {value: 'inset', label: 'inset'},
  {value: 'outset', label: 'outset'},
  {value: 'none', label: 'none'},
  {value: 'hidden', label: 'hidden'},
];

export const STYLE_CONFIG = {
  widthAndHeight: {
    default: 0,
    label: 'Width & Height:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    additionalKeysToUpdate: ['width', 'height'],
    widgetProps: {
      min: 0,
      max: () => Math.max(window.innerWidth, window.innerHeight),
    }
  },
  width: {
    default: 0,
    label: 'Width:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: () => Math.max(window.innerWidth, window.innerHeight),
    }
  },
  height: {
    default: 0,
    label: 'Height:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: () => Math.max(window.innerWidth, window.innerHeight),
    }
  },
  backgroundColor: {
    default: '',
    label: 'Background:',
    parsePx: false,
    widget: WIDGET_TYPES.COLOR,
    styleAttributeName: 'background-color'
  },
  borderAllWidth: {
    default: 0,
    label: 'Border: All width:',
    parsePx: false,
    widget: WIDGET_TYPES.SLIDER,
    additionalKeysToUpdate: ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth'],
    customSetAttribute: 'setBorderAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderTopWidth: {
    default: 0,
    label: 'Border: Top width:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setBorderAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderRightWidth: {
    default: 0,
    label: 'Border: Right width:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setBorderAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderBottomWidth: {
    default: 0,
    label: 'Border: Bottom width:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setBorderAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderLeftWidth: {
    default: 0,
    label: 'Border: Left width:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setBorderAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderColor: {
    default: '',
    label: 'Border-color:',
    parsePx: false,
    widget: WIDGET_TYPES.COLOR,
    customSetAttribute: 'setBorderAttributes'
  },
  borderStyle: {
    default: '',
    label: 'Border-style:',
    parsePx: false,
    widget: WIDGET_TYPES.SELECT,
    selectOptions: BORDER_STYLE_OPTIONS,
    customSetAttribute: 'setBorderAttributes'
  },
};
