import React, { useEffect, useState, useMemo } from 'react';
import { Button, Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import cursorPointerSelectStyles from 'src/utils/cursorPointerSelectStyles';
import { useCurrentProject } from 'src/hooks/useCurrentProject';
import { jsdataStore } from 'src/store/jsdata';
import TaskCard from 'src/components/TaskCard';
import TaskDetail from 'src/components/TaskDetail';

const ALL_TASKS_VALUE = 'ALL_TASKS';
const DEFAULT_TASK_COLUMN = { value: ALL_TASKS_VALUE, label: 'All Tasks' };

const TasksSummary = () => {
  const dispatch = useDispatch();
  const project = useCurrentProject();
  const showTaskDetail = useSelector((state) => state.views.showTaskDetail);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [taskColumns, setTaskColumns] = useState([]);
  const [selectedTaskColumn, setSelectedTaskColumn] = useState(DEFAULT_TASK_COLUMN);

  const createTask = () => {
    dispatch.app.restoreDesignChange();
    dispatch.app.enterSelectionMode();
  };

  const fetchTasks = async () => {
    if (!project) {
      return;
    }
    const fetchedTasks = await jsdataStore.findAll(
      'task',
      {
        'filter{project}': project.id,
        include: [
          'task_metadata.',
          'task_comments.creator_full_name.',
          'task_comments.creator',
          'task_column.',
          'creator_full_name',
          'assigned_to_full_name',
        ],
        sort: ['-task_number'],
      },
      { force: true }
    );
    setTasks(fetchedTasks);
    setTasksLoaded(true);
  };

  const fetchTaskColumns = async () => {
    if (!project) {
      return;
    }
    const fetchedTaskColumns = await jsdataStore.findAll(
      'taskColumn',
      {
        'filter{project}': project.id,
      },
      { force: true }
    );
    setTaskColumns(fetchedTaskColumns);
  };

  jsdataStore.findAll('membership', { include: ['user.'] }, { force: true });
  useEffect(() => {
    fetchTasks();
    fetchTaskColumns();
    // eslint-disable-next-line
  }, [project]);

  useEffect(() => {
    // if the tasks change, or we are no longer on the task detail, refetch taskdommap
    if (tasks.length || !showTaskDetail) {
      dispatch.app.fetchTaskDomMap(tasks);
    }
    return () => dispatch.app.clearFetchDomMapInterval();
  }, [tasks, showTaskDetail, dispatch.app]);

  useEffect(() => {
    // on exit, restore all design changes (if applicable)
    return () => dispatch.app.restoreDesignChangeIfApplicable();
  }, [dispatch.app]);

  const sortedTaskColumns = useMemo(() => {
    return taskColumns.sort((a, b) => a.order - b.order);
  }, [taskColumns]);

  const taskColumnOptions = useMemo(() => {
    const cols = sortedTaskColumns.map((tc) => ({
      value: tc.id,
      label: tc.name,
    }));
    // Add "all tasks" option at beginning. make it the default.
    return [DEFAULT_TASK_COLUMN, ...cols];
  }, [sortedTaskColumns]);

  const filterOnTaskColumn = (option) => {
    setSelectedTaskColumn(option);
  };

  const filteredTasks = useMemo(() => {
    if (selectedTaskColumn.value === ALL_TASKS_VALUE) {
      return tasks;
    } else {
      return tasks.filter((t) => t.taskColumn.id === selectedTaskColumn.value);
    }
    // eslint-disable-next-line
  }, [tasks, selectedTaskColumn, rerender]);

  const rerenderOnTaskMove = () => {
    // super super hacky
    setRerender(!rerender); // HACKY but useStoreState isn't working correctly for individual items.
    // TODO: look into the above fix of useStoreState to get rid of above hack.
  };

  const headerContent = (
    <>
      <div className="text-sans-serif font-weight-bold">Tasks</div>
      <Select
        value={selectedTaskColumn}
        onChange={filterOnTaskColumn}
        options={taskColumnOptions}
        styles={cursorPointerSelectStyles}
        className="flex-grow-1 mx-20"
      />
    </>
  );
  const bodyContent = (
    <div className="kanban-items-container scrollbar kanban-override flex-grow-1 mt-2">
      {tasksLoaded ? (
        filteredTasks.map((task, idx) => <TaskCard taskCard={task} key={task.id} />)
      ) : (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <Spinner color="primary" />
        </div>
      )}
    </div>
  );
  const footerContent = (
    <Button color="primary" block onClick={createTask} className="mb-3 min-h-36">
      Create a Task
    </Button>
  );

  return (
    <>
      <FullToolbarLayout headerContent={headerContent} footerContent={footerContent} hidden={showTaskDetail}>
        {bodyContent}
      </FullToolbarLayout>
      {showTaskDetail && <TaskDetail taskColumns={sortedTaskColumns} rerenderOnTaskMove={rerenderOnTaskMove} />}
    </>
  );
};

export default TasksSummary;
