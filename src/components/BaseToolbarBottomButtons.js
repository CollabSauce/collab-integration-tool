import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UncontrolledTooltip, Button } from 'reactstrap';

import { setAuthToken } from 'src/utils/auth';
import { jsdataStore } from 'src/store/jsdata';

const BaseToolbarBottomButtons = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.app.currentUserId);
  const alignLeft = useSelector((state) => state.positioning.alignLeft);
  const alignRight = useSelector((state) => state.positioning.alignRight);
  const alignTop = useSelector((state) => state.positioning.alignTop);
  const alignBottom = useSelector((state) => state.positioning.alignBottom);
  const sizeFull = useSelector((state) => state.positioning.sizeFull);
  const sizeHalf = useSelector((state) => state.positioning.sizeHalf);
  const sizeQuarter = useSelector((state) => state.positioning.sizeQuarter);

  const sizingConfig = useMemo(() => {
    return [
      { type: 'Full', rotation: 90, icon: ['fas', 'arrows-alt-h'], percent: '100%', show: !sizeFull },
      { type: 'Half', rotation: 0, icon: ['fas', 'window-minimize'], percent: '50%', show: !sizeHalf },
      { type: 'Quarter', rotation: 0, icon: ['far', 'window-minimize'], percent: '25%', show: !sizeQuarter },
    ].filter((config) => config.show);
  }, [sizeFull, sizeHalf, sizeQuarter]);

  const alignmentConfig = useMemo(() => {
    return [
      { type: 'Left', rotation: 270, show: !alignLeft },
      { type: 'Right', rotation: 90, show: !alignRight },
      { type: 'Top', rotation: 0, show: !alignTop },
      { type: 'Bottom', rotation: 180, show: !alignBottom },
    ].filter((config) => config.show);
  }, [alignLeft, alignRight, alignTop, alignBottom]);

  const logout = () => {
    dispatch.views.setShowLogout(true);
    setAuthToken();
    jsdataStore.clear();
    dispatch.app.setCurrentUserId();
    dispatch.app.showFullToolbar();
  };

  return (
    <div className="d-flex align-items-center flex-column">
      {isAuthenticated && (
        <Button onClick={logout} color="link" className="fs--1 pl-0 pr-0">
          Logout
        </Button>
      )}
      <div>
        {sizingConfig.map(({ type, icon, percent, rotation }, idx) => (
          <React.Fragment key={type}>
            <FontAwesomeIcon
              id={`collab-move-toolbar-${type}`}
              className={`clickable-icon ${idx === 0 ? 'mr-1' : 'ml-1'}`}
              icon={icon}
              rotation={rotation}
              onClick={() => dispatch.positioning.size(type)}
            />
            <UncontrolledTooltip
              placement="auto"
              target={`collab-move-toolbar-${type}`}
              innerClassName="collab-toolbar-tooltip"
            >
              Toolbar {percent}
            </UncontrolledTooltip>
          </React.Fragment>
        ))}
      </div>
      <div>
        {alignmentConfig.map(({ type, rotation }, idx) => (
          <React.Fragment key={type}>
            <FontAwesomeIcon
              id={`collab-move-toolbar-${type}`}
              className={`clickable-icon ${idx === 0 ? 'mr-1' : 'ml-1'}`}
              icon={['far', 'window-maximize']}
              rotation={rotation}
              onClick={() => dispatch.positioning.align(type)}
            />
            <UncontrolledTooltip
              placement="auto"
              target={`collab-move-toolbar-${type}`}
              innerClassName="collab-toolbar-tooltip"
            >
              Move Toolbar {type}
            </UncontrolledTooltip>
          </React.Fragment>
        ))}
      </div>
      <div>
        <FontAwesomeIcon
          id="collab-close-toolbar"
          className="clickable-icon"
          icon="angle-right"
          rotation={alignRight ? 0 : 180}
          onClick={() => dispatch.app.hideToolbar()}
        />
        <UncontrolledTooltip placement="auto" target="collab-close-toolbar" innerClassName="collab-toolbar-tooltip">
          Close Toolbar
        </UncontrolledTooltip>
      </div>
    </div>
  );
};

export default BaseToolbarBottomButtons;
