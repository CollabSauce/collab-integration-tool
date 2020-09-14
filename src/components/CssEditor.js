import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SketchPicker } from 'react-color';
import Select from 'react-select';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Collapse, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CodeHighlight from 'src/components/CodeHighlight';
import Switch from 'src/components/Switch';
import RangeSlider, { RangeInputBox } from 'src/components/RangeSlider';
import { STYLE_ATTRIBUTE_CONFIG, STYLE_CONFIG, NESTED_STYLE_CONFIG, WIDGET_TYPES } from 'src/utils/cssEditorConfig';

const CollapseHeader = ({ children, onClick, isOpen, className, classNameChildrenContent }) => (
  <div onClick={onClick} className={classNames('py-2 cursor-pointer', className)}>
    <FontAwesomeIcon icon="caret-right" transform={`rotate-${isOpen ? 90 : 0})`} />
    <span className={classNames('font-weight-semi-bold text-sans-serif pl-3', classNameChildrenContent)}>
      {children}
    </span>
  </div>
);

const CssEditor = () => {
  const dispatch = useDispatch();
  const [adjustableStyleProps, setAdjustableStyleProps] = useState(null);
  const [originalStyleAttributes, setOriginalStyleAttributes] = useState([]);
  const [currentTargetInfo, setCurrentTargetInfo] = useState({});

  const [openCollapsibleStates, setOpenCollapsibleStates] = useState({});
  const [hasDesignChanges, setHasDesignChanges] = useState(false);

  const parentOrigin = useSelector((state) => state.app.parentOrigin);
  const targetStyle = useSelector((state) => state.app.targetStyle);
  const targetDomPath = useSelector((state) => state.app.targetDomPath);
  const targetCssText = useSelector((state) => state.app.targetCssText);
  const targetInElementStyling = useSelector((state) => state.app.targetInElementStyling);
  const targetId = useSelector((state) => state.app.targetId);
  const cssCodeChanges = useSelector((state) => state.app.cssCodeChanges);

  const onCopyToClipboard = () => toast.info('Copied to clipboard!');

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
      // the in-element-style object takes precedence over the new 'styleData', which is normal css.
      const styleObjectToUse =
        targetInElementStyling[config.customParseFnKey] || targetInElementStyling[key]
          ? targetInElementStyling
          : targetStyle;
      if (config.customParseFn) {
        val = config.customParseFn(styleObjectToUse[config.customParseFnKey]);
      } else if (config.additionalKeysToUpdate) {
        val = config.default;
      } else if (config.widget === WIDGET_TYPES.SELECT) {
        const valToCompare = config.parseIntOnRead ? parseInt(styleObjectToUse[key]) : styleObjectToUse[key];
        val = config.selectOptions.find((option) => option.value === valToCompare);
      } else if (config.parsePx) {
        val = parsePx(styleObjectToUse[key]);
      } else {
        val = styleObjectToUse[key];
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
          originalInElementStyling: targetInElementStyling,
          originalStyleData: styleData,
          originalStylingTrackedByUs: calculateStyleAttributes(styleData),
        },
      ]);
    }
    setCurrentTargetInfo({ targetId, targetDomPath });

    // Now save the styleData the is used in our render function.
    setAdjustableStyleProps(styleData);
  }, [originalStyleAttributes, targetStyle, targetDomPath, targetCssText, targetInElementStyling, targetId]);

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
    const originalInElementStyling = styleAttributeDataForElement.originalInElementStyling;
    const originalInElementStylingHash = Object.keys(originalInElementStyling).reduce(
      (hash, key) => ({ ...hash, [key]: true }),
      {}
    );

    const styleAttrsToSet = Object.entries(styleAttributes).reduce((currentUpdateObj, [property, value]) => {
      if (originalStyleForElement[property] === value) {
        if (originalInElementStylingHash[property]) {
          // if the value is the same as the original value and it is in-element-styling,
          // don't clear the styling of that property
          return currentUpdateObj;
        } else {
          // if the value is the same as the original value and it's not in-element-styling,
          // set to the empty string so we clear the styling for that property
          return { ...currentUpdateObj, [property]: '' };
        }
      } else {
        // if the vale has changed from the original, set that property value
        return { ...currentUpdateObj, [property]: value };
      }
    }, {});

    // dispatch event to parent
    const message = { type: 'setStyleAttribute', styleAttrsToSet };
    window.parent.postMessage(JSON.stringify(message), parentOrigin);

    // check to see if we made any changes - see if any element has a non-empty string.
    setHasDesignChanges(!!Object.values(styleAttrsToSet).find((val) => val !== ''));
    updateCodeChange(styleAttrsToSet);
  };

  const setSliderVal = (key, val) => {
    const additionalKeys = STYLE_CONFIG[key].additionalKeysToUpdate || [];
    const additionalKeyVals = additionalKeys.reduce((prev, additionalKey) => ({ ...prev, [additionalKey]: val }), {});
    const newStyleData = { ...adjustableStyleProps, [key]: val, ...additionalKeyVals };
    setAdjustableStyleProps(newStyleData);
    notifyTargetOfNewStyle(newStyleData);
  };

  const setColorVal = (key, color) => {
    const { r, g, b, a } = color.rgb;
    const newStyleData = { ...adjustableStyleProps, [key]: `rgba(${r}, ${g}, ${b}, ${a})` };
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

  const toggleOpenStates = (propName) => {
    const newState = {
      ...openCollapsibleStates,
      [propName]: !openCollapsibleStates[propName],
    };
    setOpenCollapsibleStates(newState);
  };

  const restoreChanges = () => {
    const styleAttributeDataForElement = findStyleAttributeForElement(originalStyleAttributes, targetId, targetDomPath);
    const { originalCssText, originalStyleData } = styleAttributeDataForElement;
    const message = { type: 'restoreChanges', originalCssText };
    window.parent.postMessage(JSON.stringify(message), parentOrigin);
    setAdjustableStyleProps(originalStyleData);
    setHasDesignChanges(false);
    dispatch.app.setCssCodeChanges('');
  };

  const updateCodeChange = (styleAttrsToSet) => {
    const str = Object.keys(styleAttrsToSet)
      .reduce((str, styleKey) => {
        return styleAttrsToSet[styleKey] ? `${str}\n${styleKey}: ${styleAttrsToSet[styleKey]} !important;` : str;
      }, '')
      .trim();
    dispatch.app.setCssCodeChanges(str);
  };

  if (!adjustableStyleProps) {
    return null;
  }

  return (
    <>
      <CollapseHeader
        onClick={() => toggleOpenStates('designEdits')}
        isOpen={openCollapsibleStates.designEdits}
        className="d-flex align-items-center h-55"
        classNameChildrenContent="d-inline-flex flex-grow-1 justify-content-between align-items-center"
      >
        <>
          <span>Design Edits</span>
          {hasDesignChanges && (
            <Button color="falcon-danger fs--1 pl-2 pr-2" onClick={restoreChanges}>
              Restore Changes
            </Button>
          )}
        </>
      </CollapseHeader>
      <Collapse isOpen={openCollapsibleStates.designEdits}>
        <>
          {NESTED_STYLE_CONFIG.map(({ category, items }) => (
            <React.Fragment key={category}>
              <CollapseHeader
                onClick={() => toggleOpenStates(category)}
                isOpen={openCollapsibleStates[category]}
                className="ml-2"
              >
                {category}
              </CollapseHeader>
              <Collapse isOpen={openCollapsibleStates[category]} className="px-2">
                <>
                  {Object.entries(items).map(([key, item]) => {
                    let Widget;
                    if (item.widget === WIDGET_TYPES.SLIDER) {
                      Widget = (
                        <RangeSlider
                          min={
                            typeof item.widgetProps.min === 'function' ? item.widgetProps.min() : item.widgetProps.min
                          }
                          max={
                            typeof item.widgetProps.max === 'function' ? item.widgetProps.max() : item.widgetProps.max
                          }
                          value={adjustableStyleProps[key] || 0}
                          onChange={(e) => setSliderVal(key, e.currentTarget.value)}
                          tooltipPlacement="top"
                        />
                      );
                    } else if (item.widget === WIDGET_TYPES.COLOR) {
                      Widget = (
                        <SketchPicker
                          onChange={(color) => setColorVal(key, color)}
                          color={adjustableStyleProps[key] || ''}
                          width={225}
                          className="my-3"
                        />
                      );
                    } else if (item.widget === WIDGET_TYPES.SELECT) {
                      Widget = (
                        <Select
                          value={adjustableStyleProps[key] || null}
                          onChange={(option) => setSelectVal(key, option)}
                          options={item.selectOptions}
                          className="my-3"
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
                        <div className="d-flex align-items-center">
                          <p className="fs--1 flex-grow-1 mb-0">{item.label}</p>
                          {item.widget === WIDGET_TYPES.SLIDER && (
                            <RangeInputBox
                              value={adjustableStyleProps[key] || 0}
                              onChange={(e) => setSliderVal(key, e.currentTarget.value)}
                            />
                          )}
                        </div>
                        {Widget}
                      </div>
                    );
                  })}
                </>
              </Collapse>
            </React.Fragment>
          ))}
          <CollapseHeader
            onClick={() => toggleOpenStates('viewCodeChange')}
            isOpen={openCollapsibleStates['viewCodeChange']}
            className="ml-2"
            classNameChildrenContent="text-warning"
          >
            View Code Change
          </CollapseHeader>
          <Collapse isOpen={openCollapsibleStates['viewCodeChange']} className="px-2">
            <div className="position-relative max-w-245">
              <CodeHighlight code={cssCodeChanges} language="css" dark />
              <CopyToClipboard text={cssCodeChanges} onCopy={onCopyToClipboard}>
                <Button color="primary" className="position-absolute top-right">
                  Copy Code
                </Button>
              </CopyToClipboard>
            </div>
          </Collapse>
        </>
      </Collapse>
    </>
  );
};

export default CssEditor;
