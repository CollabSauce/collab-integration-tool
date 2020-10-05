import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import rocket from 'src/assets/rocket.png';

const LogoutContent = ({ titleTag: TitleTag }) => {
  const dispatch = useDispatch();

  return (
    <>
      <img className="d-block mx-auto mb-4" src={rocket} alt="shield" width={70} />
      <TitleTag>See you again!</TitleTag>
      <p>
        Thanks for using Collab Sauce. You are <br className="d-none d-sm-block" />
        now successfully signed out.
      </p>
      <Button onClick={() => dispatch.views.setShowLogin(true)} color="primary" size="sm" className="mt-3">
        <FontAwesomeIcon icon="chevron-left" transform="shrink-4 down-1" className="mr-1" />
        Return to Login
      </Button>
    </>
  );
};

LogoutContent.propTypes = {
  titleTag: PropTypes.string,
};

LogoutContent.defaultProps = {
  titleTag: 'h4',
};

export default LogoutContent;
