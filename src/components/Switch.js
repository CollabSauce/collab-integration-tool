import React from 'react';

// https://upmostly.com/tutorials/build-a-react-switch-toggle-component
export const Switch = ({ isOn, handleToggle, onColor, labelLeft, labelRight }) => {
  return (
    <div className="react-switch-container mt-3">
      <p>{labelLeft}</p>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id="react-switch-new"
        type="checkbox"
      />
      <label style={{ background: isOn && onColor }} className="react-switch-label mx-2" htmlFor="react-switch-new">
        <span className="react-switch-button" />
      </label>
      <p>{labelRight}</p>
    </div>
  );
};
