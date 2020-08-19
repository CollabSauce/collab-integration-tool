import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import Draggable from 'react-draggable';
import Slider from 'rc-slider';
import Select from 'react-select';
import 'rc-slider/assets/index.css';

import './App.css';
import { STYLE_CONFIG, WIDGET_TYPES } from 'src/config';

const isParent = (obj, parentObj) => {
  while (obj !== undefined && obj !== null && obj.tagName.toUpperCase() !== 'BODY') {
    if (obj === parentObj) return true;
    obj = obj.parentNode;
  }
  return false;
};


const DEFAULT_STYLE_STATE = Object.entries(STYLE_CONFIG).reduce((currentResult, [key, config]) => {
  return { ...currentResult, [key]: config.default };
}, {});

function App() {

  const [clickedTarget, setClickedTarget] = useState(null);
  const [clickedTargetCustomStyle, setClickedTargetCustomStyle] = useState({});
  const targetRef = useRef();

  const [adjustableStyleProps, setAdjustableStyleProps] = useState(DEFAULT_STYLE_STATE);

  const onClick = useCallback((e) => {
    const toolbar = document.querySelector('.toolbar');
    if (toolbar.isEqualNode(e.target) || isParent(e.target, toolbar)) {
      return;
    }

    e.preventDefault();
    setClickedTarget(e.target);
  }, []);

  const onMouseOver = useCallback((e) => {
    const toolbar = document.querySelector('.toolbar');
    if (toolbar.isEqualNode(e.target) || isParent(e.target, toolbar)) {
      return;
    }

    if (targetRef.current) {
      targetRef.current.classList.remove('__outline__');
      targetRef.current.removeEventListener('click', onClick);
    }
    targetRef.current = e.target;
    targetRef.current.classList.add('__outline__');
    targetRef.current.addEventListener('click', onClick);
  }, [onClick]);

  const parsePx = (val) => {
    if (typeof val === 'string' && val.slice(-2) === 'px') {
      return val.slice(0, -2);
    } else {
      return val;
    }
  };

  useEffect(() => {
    document.body.addEventListener('mouseover', onMouseOver);
    document.body.classList.add('__special-cursor__');
    return () => document.body.removeEventListener('mouseover', onMouseOver);
  }, [onMouseOver]);

  useEffect(() => {
    if (!clickedTarget) { return; }
    const targetStyle = getComputedStyle(clickedTarget);
    const newAdjustStyleProps = Object.entries(STYLE_CONFIG).reduce((currentResult, [key, config]) => {
      let val = config.additionalKeysToUpdate ? config.default : targetStyle[key];
      if (config.parsePx) {
        val = parsePx(val);
      }
      if (config.widget === WIDGET_TYPES.SELECT) {
        val = config.selectOptions.find((option) => option.value === val);
      }
      return { ...currentResult, [key]: val };
    }, {});
    setAdjustableStyleProps(newAdjustStyleProps);
  }, [clickedTarget]);

  const setAttribute = useCallback((updateObj) => {
    const updatedCustomStyle = { ...clickedTargetCustomStyle, ...updateObj };
    setClickedTargetCustomStyle(updatedCustomStyle);
    const updatedStyleStr = Object.entries(updatedCustomStyle).reduce((currentString, [property, value]) => {
      return `${currentString} ${property}: ${value} !important;`
    }, '');
    clickedTarget.setAttribute('style', updatedStyleStr);
  }, [clickedTarget, clickedTargetCustomStyle]);

  const customSetAttributes = {
    setBorderAttributes: (newStyleProps) => {
      const borderWidthAttribute = getBorderWidthAttribute(newStyleProps);
      const borderColorAttribute = newStyleProps.borderColor;
      const borderStyleAttribute = newStyleProps.borderStyle ? newStyleProps.borderStyle.value : '';
      setAttribute({
        'border-width': borderWidthAttribute,
        'border-color': borderColorAttribute,
        'border-style': borderStyleAttribute
      });
    }
  };

  const setSliderVal = (key, val) => {
    const additionalKeys = STYLE_CONFIG[key].additionalKeysToUpdate || [];
    const attributeVal = STYLE_CONFIG[key].parsePx ? `${val}px` : val;

    const additionalKeyVals = additionalKeys.reduce((prev, additionalKey) => ({ ...prev, [additionalKey]: val }), {});

    const newState = { ...adjustableStyleProps, [key]: val, ...additionalKeyVals };
    setAdjustableStyleProps(newState);
    if (STYLE_CONFIG[key].customSetAttribute) {
      const fnName = STYLE_CONFIG[key].customSetAttribute;
      customSetAttributes[fnName](newState);
    } else if (additionalKeys.length) {
      const additionalKeyAttributes = additionalKeys.reduce((prev, additionalKey) => ({ ...prev, [additionalKey]: attributeVal }), {});
      setAttribute(additionalKeyAttributes); // only set attributes on these additional keys, not the passed in key
    } else {
      const attrKey = STYLE_CONFIG[key].styleAttributeName || key;
      setAttribute({ [attrKey]: attributeVal });
    }
  };

  const setColorVal = (key, color) => {
    const newState = { ...adjustableStyleProps, [key]: color.hex };
    setAdjustableStyleProps(newState);
    if (STYLE_CONFIG[key].customSetAttribute) {
      const fnName = STYLE_CONFIG[key].customSetAttribute;
      customSetAttributes[fnName](newState);
    } else {
      const attrKey = STYLE_CONFIG[key].styleAttributeName || key;
      setAttribute({ [attrKey]: color.hex });
    }
  };

  const setSelectVal = (key, option) => {
    const newState = { ...adjustableStyleProps, [key]: option };
    setAdjustableStyleProps(newState);
    if (STYLE_CONFIG[key].customSetAttribute) {
      const fnName = STYLE_CONFIG[key].customSetAttribute;
      customSetAttributes[fnName](newState);
    } else {
      const attrKey = STYLE_CONFIG[key].styleAttributeName || key;
      setAttribute({ [attrKey]: option.value });
    }
  };

  const getBorderWidthAttribute = (newStyleProps) => {
    const { borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth } = newStyleProps;
    if (borderTopWidth === borderRightWidth && borderTopWidth === borderBottomWidth && borderTopWidth === borderLeftWidth) {
      return `${borderLeftWidth}px`;
    } else if (borderTopWidth === borderBottomWidth && borderLeftWidth === borderRightWidth) {
      return `${borderTopWidth}px ${borderLeftWidth}px`;
    } else {
      return `${borderTopWidth}px ${borderRightWidth}px ${borderBottomWidth}px ${borderLeftWidth}px`;
    }
  };

  return (
    <div className="App">
      <div className="App-body">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

      </div>
      <Draggable handle=".draggableTarget">
        <div className="toolbar">
          <div className="draggableTarget">Drag Me</div>
          {Object.entries(STYLE_CONFIG).map(([key, item]) => {
            let Widget;
            if (item.widget === WIDGET_TYPES.SLIDER) {
              Widget = (
                <Slider
                  min={typeof item.widgetProps.min === 'function' ? item.widgetProps.min() : item.widgetProps.min}
                  max={typeof item.widgetProps.max === 'function' ? item.widgetProps.max() : item.widgetProps.max}
                  value={adjustableStyleProps[key]}
                  onChange={(val) => setSliderVal(key, val)}
                />
              );
            } else if (item.widget === WIDGET_TYPES.COLOR) {
              Widget = (
                <SketchPicker
                  onChange={(color) => setColorVal(key, color)}
                  color={adjustableStyleProps[key]}
                />
              );
            } else if (item.widget === WIDGET_TYPES.SELECT) {
              Widget = (
                <Select
                  value={adjustableStyleProps[key]}
                  onChange={(option) => setSelectVal(key, option)}
                  options={item.selectOptions}
                />
              );
            }
            return (
              <div key={key}>
                <p>{item.label}</p>
                {Widget}
              </div>
            )
          })}
        </div>
      </Draggable>
    </div>
  );
}

export default App;
