import React from 'react';

// https://upmostly.com/tutorials/build-a-react-switch-toggle-component
export const Switch = ({ isOn, handleToggle, onColor, labelLeft, labelRight }) => {
  return (
    <div className="d-flex align-items-center my-3">
      <p className="font-weight-normal text-sans-serif fs--2 m-0">{labelLeft}</p>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id="react-switch-new"
        type="checkbox"
      />
      <label
        style={{ background: isOn && onColor }}
        className="react-switch-label mx-2 my-0"
        htmlFor="react-switch-new"
      >
        <span className="react-switch-button" />
      </label>
      <p className="font-weight-normal text-sans-serif fs--2 m-0">{labelRight}</p>
    </div>
  );
};
