import { ChannelRecord, Issue, Project } from './spaceTypes';

interface UseLocalCache {
  kind: 'Issue' | 'Project' | 'Channel';
}

type CachedObjects = Issue | Project | ChannelRecord;

export default function useLocalCache({ kind }: UseLocalCache) {
  return {
    updateCache: (id: string, data: CachedObjects) => {
      const cacheKey = `Space:${kind}:${id}`;
      const localJSON = localStorage.getItem(cacheKey);

      if (localJSON) {
        const localData = JSON.parse(localJSON);
        data = { ...localData, ...data };
      } else {
        data = { ...data, id };
      }

      localStorage.setItem(cacheKey, JSON.stringify(data));
    },
    getCache: (id: string): CachedObjects | null => {
      const cacheKey = `Space:${kind}:${id}`;
      const localJSON = localStorage.getItem(cacheKey);

      if (localJSON) {
        return JSON.parse(localJSON);
      }
      return null;
    },
  };
}
