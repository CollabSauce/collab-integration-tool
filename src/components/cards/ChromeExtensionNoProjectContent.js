import React from 'react';
import { Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { DASHBOARD_URL } from 'src/constants';

const ChromeExtensionNoProjectContent = () => {
  const dispatch = useDispatch();
  const plusButtonClicked = useSelector((state) => state.baseToolbar.plusButtonClicked);
  const webPaintButtonClicked = useSelector((state) => state.baseToolbar.webPaintButtonClicked);
  const parentOrigin = useSelector((state) => state.app.parentOrigin);
  const projectKey = useSelector((state) => state.app.projectKey);
  const isChromeExtension = useSelector((state) => state.app.isChromeExtension);

  return (
    <>
      <p className="fs-4 mt--25">
        <span role="img" aria-label="siren">
          🚨
        </span>
      </p>
      <p>
        It looks like this website has not been registered with Collab Sauce.{' '}
        <a href={`${DASHBOARD_URL}/signup`} target="_blank" rel="noopener noreferrer">
          Sign up for Collab Sauce
        </a>{' '}
        and enter <i>{parentOrigin}</i> when creating a project.
      </p>
      {isChromeExtension && !projectKey && (
        <p>Css Editor, WebPaint, and Gridlines is still available to you. However, task creation is not available.</p>
      )}
      <Button color="primary" block className="mt-3 fs--1" onClick={() => dispatch.app.hideFullToolbar()}>
        Ok, got it
      </Button>
      {(plusButtonClicked || webPaintButtonClicked) && (
        <Button
          outline
          color="info"
          block
          className="mt-3 px-2 fs--1"
          onClick={() => (plusButtonClicked ? dispatch.app.enterSelectionMode() : dispatch.app.toggleWebPaint())}
        >
          Continue Without Org Access
        </Button>
      )}
    </>
  );
};

export default ChromeExtensionNoProjectContent;
