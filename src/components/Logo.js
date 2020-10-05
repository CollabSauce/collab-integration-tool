import React from 'react';
import PropTypes from 'prop-types';

import logo from 'src/assets/collab-logo.svg';

const Logo = ({ at, width, className, ...rest }) => {
  return (
    <div {...rest}>
      <div className={'d-flex flex-center mb-4'}>
        <img className="mr-2" src={logo} alt="Logo" width={width} />
        <div className="d-flex flex-column text-sans-serif text-dark">
          <p className="mb-0 font-weight-medium fs-3">Collab</p>
          <p className="mb-0 font-weight-normal text-right fs--1 logo-sauce-text-auth">Sauce</p>
        </div>
      </div>
    </div>
  );
};

Logo.propTypes = {
  width: PropTypes.number,
  className: PropTypes.string,
};

Logo.defaultProps = { width: 66 };

export default Logo;
