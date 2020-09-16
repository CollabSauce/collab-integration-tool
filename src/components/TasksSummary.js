import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import FullToolbarLayout from 'src/layouts/FullToolbarLayout';
import { useCurrentProject } from 'src/hooks/useCurrentProject';
import { jsdataStore } from 'src/store/jsdata';
import TaskCard from 'src/components/TaskCard';

const TasksSummary = () => {
  const dispatch = useDispatch();
  const taskDomMap = useSelector((state) => state.app.taskDomMap);
  const project = useCurrentProject();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    if (!project) {
      return;
    }
    const fetchedTasks = await jsdataStore.findAll(
      'task',
      {
        'filter{project}': project.id,
        include: ['task_metadata.', 'task_comments.creator.', 'task_column.', 'creator.'],
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
  }, [tasks, dispatch.app]);

  const headerContent = <div className="text-sans-serif font-weight-bold">Tasks</div>;
  const bodyContent = (
    <div className="kanban-items-container scrollbar kanban-override">
      {tasks.map((task, idx) => (
        <TaskCard taskCard={task} key={task.id} taskDomMap={taskDomMap} />
      ))}
    </div>
  );
  const footerContent = (
    <Button color="primary" block onClick={() => {}} className="mb-3">
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
