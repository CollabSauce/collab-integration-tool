import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TaskDetailScreenshot = ({ src }) => (
  <div className="cursor-pointer mb-3 position-relative">
    <a href={src} target="_blank" rel="noopener noreferrer" className="color-inherit">
      <img src={src} alt="collab-screenshot" className="max-w-260" />
      <div className="screenshot-img-overlay d-flex align-items-center justify-content-center position-absolute">
        <FontAwesomeIcon icon="external-link-alt" />
      </div>
    </a>
  </div>
);

export default TaskDetailScreenshot;
