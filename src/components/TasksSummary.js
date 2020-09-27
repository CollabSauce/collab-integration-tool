import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import { useCurrentProject } from 'src/hooks/useCurrentProject';
import { jsdataStore } from 'src/store/jsdata';
import TaskCard from 'src/components/TaskCard';

const TasksSummary = () => {
  const dispatch = useDispatch();
  const project = useCurrentProject();
  const [tasks, setTasks] = useState([]);

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
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [project]);

  useEffect(() => {
    if (tasks.length) {
      dispatch.app.fetchTaskDomMap(tasks);
    }
    return () => dispatch.app.clearFetchDomMapInterval();
  }, [tasks, dispatch.app]);

  useEffect(() => {
    // on exit, restore all design changes (if applicable)
    return () => dispatch.app.restoreDesignChangeIfApplicable();
  }, [dispatch.app]);

  const headerContent = <div className="text-sans-serif font-weight-bold">Tasks</div>;
  const bodyContent = (
    <div className="kanban-items-container scrollbar kanban-override">
      {tasks.map((task, idx) => (
        <TaskCard taskCard={task} key={task.id} />
      ))}
    </div>
  );
  const footerContent = (
    <Button color="primary" block onClick={createTask} className="mb-3">
      Create a Task
    </Button>
  );

  return (
    <FullToolbarLayout headerContent={headerContent} footerContent={footerContent}>
      {bodyContent}
    </FullToolbarLayout>
  );
};

export default TasksSummary;
