export interface FetcherOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
}

export function fetchSpace({ path, method, query }: FetcherOptions) {
  return fetch(`/api/space`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, method, query }),
  });
}
