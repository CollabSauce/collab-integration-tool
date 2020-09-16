import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CollapseHeader = ({
  children,
  onClick,
  isOpen,
  className,
  classNameChildrenContent,
  fontWeight = 'font-weight-semi-bold',
}) => (
  <div onClick={onClick} className={classNames('py-2 cursor-pointer', className)}>
    <FontAwesomeIcon icon="caret-right" transform={`rotate-${isOpen ? 90 : 0})`} />
    <span className={classNames('text-sans-serif pl-3', classNameChildrenContent, fontWeight)}>{children}</span>
  </div>
);

export default CollapseHeader;
