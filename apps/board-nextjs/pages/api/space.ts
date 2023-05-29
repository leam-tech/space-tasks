import { NextApiRequest, NextApiResponse } from 'next';
import { FetcherOptions } from 'swr/fetcher';

const token = process.env.SPACE_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const params = req.body as FetcherOptions;

  if (params.query) {
    const queryString = Object.entries(params.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    params.path = `${params.path}?${queryString}`;
  }

  const r = await fetch(`https://leam.jetbrains.space/${params.path}`, {
    method: params.method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  res.status(r.status).json(await r.json());
}
