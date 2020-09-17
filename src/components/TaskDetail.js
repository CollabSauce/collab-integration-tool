import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Collapse, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CodeHighlight from 'src/components/CodeHighlight';
import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import { jsdataStore } from 'src/store/jsdata';
import CollapseHeader from 'src/components/CollapseHeader';
import TaskCard from 'src/components/TaskCard';
import TaskDetailScreenshot from 'src/components/TaskDetailScreenshot';

const TaskDetail = () => {
  const dispatch = useDispatch();
  const currentTaskDetail = useSelector((state) => state.app.currentTaskDetail);
  const designChangeViewingTask = useSelector((state) => state.app.designChangeViewingTask);
  const taskDomMap = useSelector((state) => state.app.taskDomMap);
  const [task, setTask] = useState(null);
  const [openCollapsibleStates, setOpenCollapsibleStates] = useState({});

  const onCopyToClipboard = () => toast.info('Copied to clipboard!');

  const fetchTask = async () => {
    // we already have the task loaded, but fetch it again incase we eventually want more data.
    // Also, it's a fast way to kill time untill the screenshots are ready.
    const fetchedTask = await jsdataStore.find('task', currentTaskDetail.id, {
      include: ['task_metadata.', 'task_comments.creator.', 'task_column.', 'creator.'],
      force: true,
    });
    setTask(fetchedTask);
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line
  }, [currentTaskDetail]);

  useEffect(() => {
    if (task) {
      if (taskDomMap[task.id]) {
        dispatch.app.selectTaskOnDom(task);
      } else {
        toast.warning(
          'This task could not be found on the page. Either the element was removed, or the task was created on a different url.'
        );
      }
    }
    // eslint-disable-next-line
  }, [task, dispatch.app]);

  const viewDesignChange = () => {
    if (!taskDomMap[task.id]) {
      return;
    }
    dispatch.app.viewDesignChange(task);
  };

  const restoreDesignChange = () => {
    dispatch.app.restoreDesignChangeKeepSelected();
  };

  useEffect(() => {
    return () => {
      // on exit, setTaskDetail to null as user is no longer on detail view.
      // on exit, restore all design changes (if applicable).
      dispatch.app.restoreDesignChange();
      dispatch.app.unselectTaskOnDom();
      dispatch.app.setCurrentTaskDetail(null);
    };
  }, [dispatch.app]);

  const toggleOpenStates = (propName) => {
    const newState = {
      ...openCollapsibleStates,
      [propName]: !openCollapsibleStates[propName],
    };
    setOpenCollapsibleStates(newState);
  };

  if (!task) {
    return null;
  }

  const headerContent = <div className="text-sans-serif font-weight-bold">Task # {task.taskNumber}</div>;
  const bodyContent = (
    <>
      <TaskCard taskCard={task} inDetailView={true} />
      {task.designEdits && (
        <>
          <CollapseHeader
            onClick={() => toggleOpenStates('designEdits')}
            isOpen={openCollapsibleStates.designEdits}
            className="ml-1"
          >
            Design Changes
          </CollapseHeader>
          <Collapse isOpen={openCollapsibleStates.designEdits} className="ml-1">
            <>
              <Button
                id={`view-design-change-${task.id}`}
                className="fs--1 mb-2"
                block
                color={designChangeViewingTask ? 'danger' : 'success'}
                onClick={designChangeViewingTask ? restoreDesignChange : viewDesignChange}
              >
                {designChangeViewingTask ? 'Dismiss Design Changes' : 'View Design Changes'}
              </Button>
              {!taskDomMap[task.id] && (
                <UncontrolledTooltip target={`view-design-change-${task.id}`}>
                  Task could not be found on the page.
                </UncontrolledTooltip>
              )}
              <div className="position-relative max-w-260">
                <CodeHighlight code={task.designEdits} language="css" dark />
                <CopyToClipboard text={task.designEdits} onCopy={onCopyToClipboard}>
                  <Button color="primary" className="position-absolute top-right fs--1">
                    Copy Code
                  </Button>
                </CopyToClipboard>
              </div>
            </>
          </Collapse>
        </>
      )}
      {(task.windowScreenshotUrl || task.elementScreenshotUrl) && (
        <>
          <CollapseHeader
            onClick={() => toggleOpenStates('screenshots')}
            isOpen={openCollapsibleStates.screenshots}
            className="ml-1"
          >
            Screenshots
          </CollapseHeader>
          <Collapse isOpen={openCollapsibleStates.screenshots} className="ml-1">
            <>
              {task.windowScreenshotUrl && <TaskDetailScreenshot src={task.windowScreenshotUrl} />}
              {task.elementScreenshotUrl && <TaskDetailScreenshot src={task.elementScreenshotUrl} />}
            </>
          </Collapse>
        </>
      )}
    </>
  );

  return <FullToolbarLayout headerContent={headerContent}>{bodyContent}</FullToolbarLayout>;
};

export default TaskDetail;
