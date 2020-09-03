import { parseBoxShadow, stringifyBoxShadow } from 'src/utils/boxShadow';

export const WIDGET_TYPES = {
  COLOR: 'color',
  SELECT: 'select',
  SLIDER: 'slider',
  SWITCH: 'switch',
};

export const BORDER_STYLE_OPTIONS = [
  { value: 'dotted', label: 'dotted' },
  { value: 'dashed', label: 'dashed' },
  { value: 'solid', label: 'solid' },
  { value: 'double', label: 'double' },
  { value: 'groove', label: 'groove' },
  { value: 'ridge', label: 'ridge' },
  { value: 'inset', label: 'inset' },
  { value: 'outset', label: 'outset' },
  { value: 'none', label: 'none' },
  { value: 'hidden', label: 'hidden' },
];

export const TEXT_ALIGN_OPTIONS = [
  { value: 'left', label: 'left' },
  { value: 'center', label: 'center' },
  { value: 'right', label: 'right' },
  { value: 'justify', label: 'justify' },
];

export const FONT_WEIGHT_OPTIONS = [
  { value: 100, label: '100' },
  { value: 200, label: '200' },
  { value: 300, label: '300' },
  { value: 400, label: '400' },
  { value: 500, label: '500' },
  { value: 600, label: '600' },
  { value: 700, label: '700' },
  { value: 800, label: '800' },
  { value: 900, label: '900' },
];

export const TOP_LEVEL_CATEGORIES = {
  BACKGROUND: 'Background',
  BORDER: 'Border',
  BORDER_RADIUS: 'Border Radius',
  BOX_SHADOW: 'Box Shadow',
  MARGIN: 'Margin',
  PADDING: 'Padding',
  SIZE: 'Size',
  TYPOGRAPHY: 'Typography',
};

export const STYLE_CONFIG = {
  backgroundColor: {
    default: '',
    label: 'Background',
    parsePx: false,
    category: TOP_LEVEL_CATEGORIES.BACKGROUND,
    widget: WIDGET_TYPES.COLOR,
  },
  borderAllWidth: {
    default: 0,
    label: 'All Width',
    parsePx: false,
    additionalKeysToUpdate: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
    category: TOP_LEVEL_CATEGORIES.BORDER,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 30,
    },
  },
  borderTopWidth: {
    default: 0,
    label: 'Top Width',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.BORDER,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 30,
    },
  },
  borderRightWidth: {
    default: 0,
    label: 'Right Width',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.BORDER,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 30,
    },
  },
  borderBottomWidth: {
    default: 0,
    label: 'Bottom Width',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.BORDER,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 30,
    },
  },
  borderLeftWidth: {
    default: 0,
    label: 'Left Width',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.BORDER,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 30,
    },
  },
  borderColor: {
    default: '',
    label: 'Border Color',
    parsePx: false,
    category: TOP_LEVEL_CATEGORIES.BORDER,
    widget: WIDGET_TYPES.COLOR,
  },
  borderStyle: {
    default: '',
    label: 'Border Style',
    parsePx: false,
    category: TOP_LEVEL_CATEGORIES.BORDER,
    widget: WIDGET_TYPES.SELECT,
    selectOptions: BORDER_STYLE_OPTIONS,
  },
  borderAllRadius: {
    default: 0,
    label: 'All Corners',
    parsePx: false,
    additionalKeysToUpdate: [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomRightRadius',
      'borderBottomLeftRadius',
    ],
    category: TOP_LEVEL_CATEGORIES.BORDER_RADIUS,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 100,
    },
  },
  borderTopLeftRadius: {
    default: 0,
    label: 'Top Left',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.BORDER_RADIUS,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 100,
    },
  },
  borderTopRightRadius: {
    default: 0,
    label: 'Top Right',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.BORDER_RADIUS,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 100,
    },
  },
  borderBottomRightRadius: {
    default: 0,
    label: 'Bottom Right',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.BORDER_RADIUS,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 100,
    },
  },
  borderBottomLeftRadius: {
    default: 0,
    label: 'Bottom Left',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.BORDER_RADIUS,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 100,
    },
  },
  marginAll: {
    default: 0,
    label: 'All Margin',
    parsePx: false,
    additionalKeysToUpdate: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    category: TOP_LEVEL_CATEGORIES.MARGIN,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  marginTop: {
    default: 0,
    label: 'Margin Top',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.MARGIN,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  marginRight: {
    default: 0,
    label: 'Margin Right',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.MARGIN,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  marginBottom: {
    default: 0,
    label: 'Margin Bottom',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.MARGIN,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  marginLeft: {
    default: 0,
    label: 'Margin Left',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.MARGIN,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  paddingAll: {
    default: 0,
    label: 'All Padding',
    parsePx: false,
    additionalKeysToUpdate: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    category: TOP_LEVEL_CATEGORIES.PADDING,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  paddingTop: {
    default: 0,
    label: 'Padding Top',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.PADDING,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  paddingRight: {
    default: 0,
    label: 'Padding Right',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.PADDING,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  paddingBottom: {
    default: 0,
    label: 'Padding Bottom',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.PADDING,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  paddingLeft: {
    default: 0,
    label: 'Padding Left',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.PADDING,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  boxShadowHorizontalOffset: {
    default: 0,
    label: 'Horizontal Offset',
    parsePx: true,
    customParseFn: (val) => {
      return parseBoxShadow(val)[0].offsetX;
    },
    category: TOP_LEVEL_CATEGORIES.BOX_SHADOW,
    customParseFnKey: 'boxShadow',
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  boxShadowVerticalOffset: {
    default: 0,
    label: 'Vertical Offset',
    parsePx: true,
    customParseFn: (val) => {
      return parseBoxShadow(val)[0].offsetY;
    },
    customParseFnKey: 'boxShadow',
    category: TOP_LEVEL_CATEGORIES.BOX_SHADOW,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  boxShadowBlurRadius: {
    default: 0,
    label: 'Blur Radius',
    parsePx: true,
    customParseFn: (val) => {
      return parseBoxShadow(val)[0].blurRadius;
    },
    customParseFnKey: 'boxShadow',
    category: TOP_LEVEL_CATEGORIES.BOX_SHADOW,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  boxShadowSpreadRadius: {
    default: 0,
    label: 'Spread Radius',
    parsePx: true,
    customParseFn: (val) => {
      return parseBoxShadow(val)[0].spreadRadius;
    },
    customParseFnKey: 'boxShadow',
    category: TOP_LEVEL_CATEGORIES.BOX_SHADOW,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  boxShadowColor: {
    default: '',
    label: 'Color',
    parsePx: false,
    customParseFn: (val) => {
      return parseBoxShadow(val)[0].color;
    },
    customParseFnKey: 'boxShadow',
    category: TOP_LEVEL_CATEGORIES.BOX_SHADOW,
    widget: WIDGET_TYPES.COLOR,
  },
  boxShadowInsetOutset: {
    default: false,
    label: 'Inset/Outset',
    inputLabelLeft: 'Outset',
    inputLabelRight: 'Inset',
    parsePx: false,
    customParseFn: (val) => {
      return parseBoxShadow(val)[0].inset;
    },
    customParseFnKey: 'boxShadow',
    category: TOP_LEVEL_CATEGORIES.BOX_SHADOW,
    widget: WIDGET_TYPES.SWITCH,
  },
  widthAndHeight: {
    default: 0,
    label: 'Width & Height',
    parsePx: true,
    additionalKeysToUpdate: ['width', 'height'],
    category: TOP_LEVEL_CATEGORIES.SIZE,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 1500,
    },
  },
  width: {
    default: 0,
    label: 'Width',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.SIZE,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 1500,
    },
  },
  height: {
    default: 0,
    label: 'Height',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.SIZE,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 1500,
    },
  },
  fontSize: {
    default: 0,
    label: 'Font Size',
    parsePx: true,
    category: TOP_LEVEL_CATEGORIES.TYPOGRAPHY,
    widget: WIDGET_TYPES.SLIDER,
    widgetProps: {
      min: 0,
      max: 200,
    },
  },
  textAlign: {
    default: '',
    label: 'Text Align',
    parsePx: false,
    selectOptions: TEXT_ALIGN_OPTIONS,
    category: TOP_LEVEL_CATEGORIES.TYPOGRAPHY,
    widget: WIDGET_TYPES.SELECT,
  },
  color: {
    default: '',
    label: 'Font Color',
    parsePx: false,
    category: TOP_LEVEL_CATEGORIES.TYPOGRAPHY,
    widget: WIDGET_TYPES.COLOR,
  },
  fontWeight: {
    default: 500,
    label: 'Font Weight',
    parsePx: false,
    selectOptions: FONT_WEIGHT_OPTIONS,
    parseIntOnRead: true,
    category: TOP_LEVEL_CATEGORIES.TYPOGRAPHY,
    widget: WIDGET_TYPES.SELECT,
  },
};

export const STYLE_ATTRIBUTE_CONFIG = {
  width: (styleData) => `${styleData.width}px`,
  height: (styleData) => `${styleData.height}px`,
  'background-color': (styleData) => styleData.backgroundColor,
  'border-width': (styleData) => {
    const { borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth } = styleData;
    if (
      borderTopWidth === borderRightWidth &&
      borderTopWidth === borderBottomWidth &&
      borderTopWidth === borderLeftWidth
    ) {
      return `${borderTopWidth}px`;
    } else if (borderTopWidth === borderBottomWidth && borderLeftWidth === borderRightWidth) {
      return `${borderTopWidth}px ${borderLeftWidth}px`;
    } else {
      return `${borderTopWidth}px ${borderRightWidth}px ${borderBottomWidth}px ${borderLeftWidth}px`;
    }
  },
  'border-color': (styleData) => styleData.borderColor,
  'border-style': (styleData) => (styleData.borderStyle ? styleData.borderStyle.value : ''),
  'border-radius': (styleData) => {
    const { borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius } = styleData;
    if (
      borderTopLeftRadius === borderTopRightRadius &&
      borderTopLeftRadius === borderBottomRightRadius &&
      borderTopLeftRadius === borderBottomLeftRadius
    ) {
      return `${borderTopLeftRadius}px`;
    } else if (borderTopLeftRadius === borderBottomRightRadius && borderTopRightRadius === borderBottomLeftRadius) {
      return `${borderTopLeftRadius}px ${borderTopRightRadius}px`;
    } else {
      return `${borderTopLeftRadius}px ${borderTopRightRadius}px ${borderBottomRightRadius}px ${borderBottomLeftRadius}px`;
    }
  },
  margin: (styleData) => {
    const { marginTop, marginRight, marginBottom, marginLeft } = styleData;
    if (marginTop === marginRight && marginTop === marginBottom && marginTop === marginLeft) {
      return `${marginTop}px`;
    } else if (marginTop === marginBottom && marginLeft === marginRight) {
      return `${marginTop}px ${marginLeft}px`;
    } else {
      return `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`;
    }
  },
  padding: (styleData) => {
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = styleData;
    if (paddingTop === paddingRight && paddingTop === paddingBottom && paddingTop === paddingLeft) {
      return `${paddingTop}px`;
    } else if (paddingTop === paddingBottom && paddingLeft === paddingRight) {
      return `${paddingTop}px ${paddingLeft}px`;
    } else {
      return `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
    }
  },
  'box-shadow': (styleData) => {
    return stringifyBoxShadow([
      {
        inset: styleData.boxShadowInsetOutset,
        offsetX: styleData.boxShadowHorizontalOffset,
        offsetY: styleData.boxShadowVerticalOffset,
        blurRadius: styleData.boxShadowBlurRadius,
        spreadRadius: styleData.boxShadowSpreadRadius,
        color: styleData.boxShadowColor,
      },
    ]);
  },
  'font-size': (styleData) => `${styleData.fontSize}px`,
  'text-align': (styleData) => (styleData.textAlign ? styleData.textAlign.value : undefined),
  color: (styleData) => styleData.color,
  'font-weight': (styleData) => (styleData.fontWeight ? styleData.fontWeight.value : undefined),
};

export const NESTED_STYLE_CONFIG = Object.values(TOP_LEVEL_CATEGORIES).map((category) => {
  const items = {};
  Object.entries(STYLE_CONFIG).forEach(([key, item]) => {
    if (item.category === category) {
      items[key] = item;
    }
  });
  return { category, items };
});
