import React from 'react';
import PropTypes from 'prop-types';

import logo from 'src/assets/collab-logo.svg';

const Logo = ({ at, width, className, ...rest }) => {
  return (
    <div {...rest}>
      <div className={'d-flex flex-center fs-4 mb-4'}>
        <span className="text-sans-serif">collab</span>
        <img className="ml-2" src={logo} alt="Logo" width={width} />
      </div>
    </div>
  );
};

Logo.propTypes = {
  width: PropTypes.number,
  className: PropTypes.string,
};

Logo.defaultProps = { width: 25 };

export default Logo;
