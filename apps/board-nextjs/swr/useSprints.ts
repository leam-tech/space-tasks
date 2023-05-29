import useSWRImmutable from 'swr/immutable';
import { SWRKeys } from './keys';
import { fetchSpace } from './fetcher';
import { Sprint } from './spaceTypes';

export default function useBoards(projectId: string) {
  return useSWRImmutable<Sprint[], unknown, string[] | null>(
    projectId ? [SWRKeys.BOARDS, projectId] : null,
    ([_, projectId]) =>
      fetchSpace({
        path: `/api/http/projects/id:${projectId}/planning/boards/sprints`,
        method: 'GET',
        query: {
          $fields:
            'data(id,archived,description,from,name,state,to,board(archived,name,from,to,id))',
        },
      })
        .then((r) => r.json())
        .then((r) => {
          const sprints = r.data as Sprint[];
          // Sort sprints by date
          sprints.sort((a, b) => {
            if (a.from.year !== b.from.year) {
              return a.from.year - b.from.year;
            }
            if (a.from.month !== b.from.month) {
              return a.from.month - b.from.month;
            }
            return a.from.day - b.from.day;
          });

          // reverse the order so that the most recent sprint is first
          sprints.reverse();

          return sprints;
        })
  );
}
