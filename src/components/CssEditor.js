import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import Slider from 'rc-slider';
import Select from 'react-select';
import 'rc-slider/assets/index.css';

import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Switch } from 'src/components/Switch';
import { STYLE_ATTRIBUTE_CONFIG, STYLE_CONFIG, NESTED_STYLE_CONFIG, WIDGET_TYPES } from 'src/utils/cssEditorConfig';

const ContextAwareToggle = ({ children, manualEventKey, callback, ...props }) => {
  const currentEventKey = useContext(AccordionContext);
  const isOpen = currentEventKey === manualEventKey;

  return (
    <div {...props}>
      <FontAwesomeIcon icon="caret-right" transform={`rotate-${isOpen ? 90 : 0})`} />
      <span className="font-weight-medium text-dark text-sans-serif pl-3">{children}</span>
    </div>
  );
};

export const CssEditor = () => {
  const [adjustableStyleProps, setAdjustableStyleProps] = useState(null);
  const [originalStyleAttributes, setOriginalStyleAttributes] = useState([]);
  const [currentTargetInfo, setCurrentTargetInfo] = useState({});
  const parentOrigin = useSelector((state) => state.app.parentOrigin);
  const targetStyle = useSelector((state) => state.app.targetStyle);
  const targetDomPath = useSelector((state) => state.app.targetDomPath);
  const targetCssText = useSelector((state) => state.app.targetCssText);
  const targetId = useSelector((state) => state.app.targetId);

  const parsePx = (val) => {
    if (typeof val === 'string' && val.slice(-2) === 'px') {
      return Number(val.slice(0, -2));
    } else {
      return val;
    }
  };

  useEffect(() => {
    const styleData = Object.entries(STYLE_CONFIG).reduce((currentResult, [key, config]) => {
      let val;
      if (config.customParseFn) {
        val = config.customParseFn(targetStyle[config.customParseFnKey]);
      } else if (config.additionalKeysToUpdate) {
        val = config.default;
      } else if (config.widget === WIDGET_TYPES.SELECT) {
        const valToCompare = config.parseIntOnRead ? parseInt(targetStyle[key]) : targetStyle[key];
        val = config.selectOptions.find((option) => option.value === valToCompare);
      } else if (config.parsePx) {
        val = parsePx(targetStyle[key]);
      } else {
        val = targetStyle[key];
      }

      return { ...currentResult, [key]: val };
    }, {});

    const styleAttributeDataForElement = findStyleAttributeForElement(originalStyleAttributes, targetId, targetDomPath);
    if (!styleAttributeDataForElement) {
      // Save original data for comparison. If we already have the original data, no need to update it.
      setOriginalStyleAttributes([
        ...originalStyleAttributes,
        {
          id: targetId,
          domPath: targetDomPath,
          originalCssText: targetCssText,
          originalStylingTrackedByUs: calculateStyleAttributes(styleData),
        },
      ]);
    }
    setCurrentTargetInfo({ targetId, targetDomPath });

    // Now save the styleData the is used in our render function.
    setAdjustableStyleProps(styleData);
  }, [originalStyleAttributes, targetStyle, targetDomPath, targetCssText, targetId]);

  const findStyleAttributeForElement = (originalStyleAttributes, targetId, targetDomPath) => {
    // First try to find it by the id of the element. If that doesn't exist find it by the DOM path.
    let originalAttribute = targetId ? originalStyleAttributes.find((attrData) => attrData.id === targetId) : null;
    return originalAttribute
      ? originalAttribute
      : originalStyleAttributes.find((attrData) => attrData.domPath === targetDomPath);
  };

  const calculateStyleAttributes = (styleData) => {
    return Object.entries(STYLE_ATTRIBUTE_CONFIG).reduce((currentObj, [property, fn]) => {
      return { ...currentObj, [property]: fn(styleData) };
    }, {});
  };

  const notifyTargetOfNewStyle = (newStyleData) => {
    const styleAttributes = calculateStyleAttributes(newStyleData);
    const { targetId, targetDomPath } = currentTargetInfo;
    const styleAttributeDataForElement = findStyleAttributeForElement(originalStyleAttributes, targetId, targetDomPath);
    const originalStyleForElement = styleAttributeDataForElement.originalStylingTrackedByUs;

    const styleAttrsToSet = Object.entries(styleAttributes).reduce((currentUpdateObj, [property, value]) => {
      // only add the values to the styleStr if it differs from the original value
      return originalStyleForElement[property] === value
        ? currentUpdateObj
        : { ...currentUpdateObj, [property]: value };
    }, {});

    // dispatch event to parent
    const message = { type: 'setStyleAttribute', styleAttrsToSet };
    window.parent.postMessage(JSON.stringify(message), parentOrigin);
  };

  const setSliderVal = (key, val) => {
    const additionalKeys = STYLE_CONFIG[key].additionalKeysToUpdate || [];
    const additionalKeyVals = additionalKeys.reduce((prev, additionalKey) => ({ ...prev, [additionalKey]: val }), {});
    const newStyleData = { ...adjustableStyleProps, [key]: val, ...additionalKeyVals };
    setAdjustableStyleProps(newStyleData);
    notifyTargetOfNewStyle(newStyleData);
  };

  const setColorVal = (key, color) => {
    const newStyleData = { ...adjustableStyleProps, [key]: color.hex };
    setAdjustableStyleProps(newStyleData);
    notifyTargetOfNewStyle(newStyleData);
  };

  const setSelectVal = (key, option) => {
    const newStyleData = { ...adjustableStyleProps, [key]: option };
    setAdjustableStyleProps(newStyleData);
    notifyTargetOfNewStyle(newStyleData);
  };

  const setSwitchVal = (key, val) => {
    const newStyleData = { ...adjustableStyleProps, [key]: val };
    setAdjustableStyleProps(newStyleData);
    notifyTargetOfNewStyle(newStyleData);
  };

  if (!adjustableStyleProps) {
    return <div>Click any element on page to adjust styling.</div>;
  }

  return (
    <Accordion>
      <Accordion.Toggle
        as={ContextAwareToggle}
        eventKey="design_edits"
        manualEventKey="design_edits"
        className="py-2 cursor-pointer"
      >
        Design Edits
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="design_edits">
        <>
          {NESTED_STYLE_CONFIG.map(({ category, items }) => (
            <Accordion key={category} className="ml-2">
              <Accordion.Toggle
                as={ContextAwareToggle}
                eventKey={category}
                manualEventKey={category}
                className="py-2 cursor-pointer"
              >
                {category}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={category} className="pl-2">
                <>
                  {Object.entries(items).map(([key, item]) => {
                    let Widget;
                    if (item.widget === WIDGET_TYPES.SLIDER) {
                      Widget = (
                        <Slider
                          min={
                            typeof item.widgetProps.min === 'function' ? item.widgetProps.min() : item.widgetProps.min
                          }
                          max={
                            typeof item.widgetProps.max === 'function' ? item.widgetProps.max() : item.widgetProps.max
                          }
                          value={adjustableStyleProps[key] || 0}
                          onChange={(val) => setSliderVal(key, val)}
                        />
                      );
                    } else if (item.widget === WIDGET_TYPES.COLOR) {
                      Widget = (
                        <SketchPicker
                          onChange={(color) => setColorVal(key, color)}
                          color={adjustableStyleProps[key] || ''}
                        />
                      );
                    } else if (item.widget === WIDGET_TYPES.SELECT) {
                      Widget = (
                        <Select
                          value={adjustableStyleProps[key] || null}
                          onChange={(option) => setSelectVal(key, option)}
                          options={item.selectOptions}
                        />
                      );
                    } else if (item.widget === WIDGET_TYPES.SWITCH) {
                      Widget = (
                        <Switch
                          isOn={adjustableStyleProps[key]}
                          onColor="#EF476F"
                          handleToggle={() => setSwitchVal(key, !adjustableStyleProps[key])}
                          labelLeft={item.inputLabelLeft}
                          labelRight={item.inputLabelRight}
                        />
                      );
                    }
                    return (
                      <div key={key}>
                        <p>{item.label}</p>
                        {Widget}
                      </div>
                    );
                  })}
                </>
              </Accordion.Collapse>
            </Accordion>
          ))}
        </>
      </Accordion.Collapse>
    </Accordion>
  );
};
