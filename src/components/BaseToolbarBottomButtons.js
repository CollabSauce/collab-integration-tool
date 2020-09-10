import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';

const BaseToolbarBottomButtons = () => {
  const dispatch = useDispatch();
  const alignLeft = useSelector((state) => state.alignment.alignLeft);
  const alignDown = useSelector((state) => state.alignment.alignDown);
  const alignRight = useSelector((state) => state.alignment.alignRight);

  return (
    <div className="d-flex align-items-center flex-column">
      <div>
        {!alignLeft && (
          <>
            <FontAwesomeIcon
              id="collab-move-toolbar-left"
              className="clickable-icon"
              icon={['far', 'window-maximize']}
              rotation={270}
              onClick={() => dispatch.alignment.align('Left')}
            />
            <UncontrolledTooltip
              placement="auto"
              target="collab-move-toolbar-left"
              innerClassName="collab-toolbar-tooltip"
            >
              Move Toolbar Left
            </UncontrolledTooltip>
          </>
        )}
        {!alignDown && false && (
          <>
            <FontAwesomeIcon
              id="collab-move-toolbar-down"
              className="clickable-icon"
              icon={['far', 'window-maximize']}
              rotation={180}
              onClick={() => dispatch.alignment.align('Down')}
            />
            <UncontrolledTooltip
              placement="auto"
              target="collab-move-toolbar-down"
              innerClassName="collab-toolbar-tooltip"
            >
              Move Toolbar Down
            </UncontrolledTooltip>
          </>
        )}
        {!alignRight && (
          <>
            <FontAwesomeIcon
              id="collab-move-toolbar-right"
              className="clickable-icon"
              icon={['far', 'window-maximize']}
              rotation={90}
              onClick={() => dispatch.alignment.align('Right')}
            />
            <UncontrolledTooltip
              placement="auto"
              target="collab-move-toolbar-right"
              innerClassName="collab-toolbar-tooltip"
            >
              Move Toolbar Right
            </UncontrolledTooltip>
          </>
        )}
      </div>
      <div>
        <FontAwesomeIcon
          id="collab-close-toolbar"
          className="clickable-icon"
          icon="angle-right"
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
