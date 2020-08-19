import { parseBoxShadow } from 'src/utils/boxShadow';

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
  borderAllRadius: {
    default: 0,
    label: 'Border Radius: All Corners:',
    parsePx: false,
    widget: WIDGET_TYPES.SLIDER,
    additionalKeysToUpdate: ['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'],
    customSetAttribute: 'setBorderRadiusAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderTopLeftRadius: {
    default: 0,
    label: 'Border Radius Top Left',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setBorderRadiusAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderTopRightRadius: {
    default: 0,
    label: 'Border Radius Top Right',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setBorderRadiusAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderBottomRightRadius: {
    default: 0,
    label: 'Border Radius Bottom Right',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setBorderRadiusAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  borderBottomLeftRadius: {
    default: 0,
    label: 'Border Radius Bottom Left',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setBorderRadiusAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  marginAll: {
    default: 0,
    label: 'Margin All:',
    parsePx: false,
    widget: WIDGET_TYPES.SLIDER,
    additionalKeysToUpdate: ['marginTop','marginRight','marginBottom','marginLeft'],
    customSetAttribute: 'setMarginAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  marginTop: {
    default: 0,
    label: 'Margin Top:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setMarginAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  marginRight: {
    default: 0,
    label: 'Margin Right:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setMarginAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  marginBottom: {
    default: 0,
    label: 'Margin Bottom:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setMarginAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  marginLeft: {
    default: 0,
    label: 'Margin Left:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setMarginAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  paddingAll: {
    default: 0,
    label: 'Padding All:',
    parsePx: false,
    widget: WIDGET_TYPES.SLIDER,
    additionalKeysToUpdate: ['paddingTop','paddingRight','paddingBottom','paddingLeft'],
    customSetAttribute: 'setPaddingAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  paddingTop: {
    default: 0,
    label: 'Padding Top:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setPaddingAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  paddingRight: {
    default: 0,
    label: 'Padding Right:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setPaddingAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  paddingBottom: {
    default: 0,
    label: 'Padding Bottom:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setPaddingAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  paddingLeft: {
    default: 0,
    label: 'Padding Left:',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customSetAttribute: 'setPaddingAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  boxShadowHorizontalOffset: {
    default: 0,
    label: 'Box Shadow Horizontal Offset',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customParseFn: (val) => { return parseBoxShadow(val)[0].offsetX },
    customParseFnKey: 'boxShadow',
    customSetAttribute: 'setBoxShadowAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  boxShadowVerticalOffset: {
    default: 0,
    label: 'Box Shadow Vertical Offset',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customParseFn: (val) => { return parseBoxShadow(val)[0].offsetY },
    customParseFnKey: 'boxShadow',
    customSetAttribute: 'setBoxShadowAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  boxShadowBlurRadius: {
    default: 0,
    label: 'Box Shadow Blur Radius',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customParseFn: (val) => { return parseBoxShadow(val)[0].blurRadius },
    customParseFnKey: 'boxShadow',
    customSetAttribute: 'setBoxShadowAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  boxShadowSpreadRadius: {
    default: 0,
    label: 'Box Shadow Spread Radius',
    parsePx: true,
    widget: WIDGET_TYPES.SLIDER,
    customParseFn: (val) => { return parseBoxShadow(val)[0].spreadRadius },
    customParseFnKey: 'boxShadow',
    customSetAttribute: 'setBoxShadowAttributes',
    widgetProps: {
      min: 0,
      max: 200,
    }
  },
  boxShadowColor: {
    default: '',
    label: 'Box Shadoww Color:',
    parsePx: false,
    widget: WIDGET_TYPES.COLOR,
    customParseFn: (val) => { return parseBoxShadow(val)[0].color },
    customParseFnKey: 'boxShadow',
    customSetAttribute: 'setBoxShadowAttributes',
  },
//   boxShadowInsetOutset: {
//
//   },
};
