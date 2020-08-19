import React from 'react';

import './Switch.css';

// https://upmostly.com/tutorials/build-a-react-switch-toggle-component
export const Switch = ({ isOn, handleToggle, onColor, labelLeft, labelRight }) => {
  return (
    <div className='react-switch-container'>
      <p>{labelLeft}</p>
      <input
        checked={isOn}
        onChange={handleToggle}
        className='react-switch-checkbox'
        id='react-switch-new'
        type='checkbox'
      />
      <label
        style={{ background: isOn && onColor }}
        className='react-switch-label'
        htmlFor='react-switch-new'
      >
        <span className='react-switch-button' />
      </label>
      <p>{labelRight}</p>
    </div>
  );
};
