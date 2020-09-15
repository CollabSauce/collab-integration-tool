import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useStoreState } from './useStoreState';

// hook that gets the current project based off the projetKey
// Example: const project = useCurrentProject();
export const useCurrentProject = () => {
  const projectKey = useSelector((state) => state.app.projectKey);
  const { result: projects } = useStoreState((store) => store.getAll('project'), [], 'project');
  return useMemo(() => projects.find((p) => p.key === projectKey), [projects, projectKey]);
};
