import React from 'react';
import PropTypes from 'prop-types';

import logo from 'src/assets/collab-logo.svg';

const Logo = ({ at, width, className, ...rest }) => {
  return (
    <div {...rest}>
      <div className={'d-flex flex-center mb-4'}>
        <img className="mr-2" src={logo} alt="Logo" width={width} />
      </div>
    </div>
  );
};

Logo.propTypes = {
  width: PropTypes.number,
  className: PropTypes.string,
};

Logo.defaultProps = { width: 145 };

export default Logo;
