import useSWRImmutable from 'swr/immutable';
import { SWRKeys } from './keys';
import { fetchSpace } from './fetcher';
import { Project } from './spaceTypes';
import useLocalCache from './useLocalCache';

export default function useProjects() {
  const localCache = useLocalCache({ kind: 'Project' });
  return useSWRImmutable<Project[]>(SWRKeys.PROJECTS, () =>
    fetchSpace({ path: 'api/http/projects', method: 'GET' })
      .then((r) => r.json())
      .then((r) => {
        const projects = r.data.map(
          (p: Partial<Project> & { key: { key: string } }) => ({
            ...p,
            key: p.key.key,
          })
        ) as Project[];

        projects.forEach((project) => {
          localCache.updateCache(project.id, project);
        });

        return projects;
      })
  );
}
