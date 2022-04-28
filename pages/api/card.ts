// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query = new URLSearchParams({
    "action": "query",
    "format": "json",
    "generator": "random",
    "grnlimit": "10",
    "grnnamespace": "0",
    "prop": "extracts",
    "exintro": "True",
    "explaintext": "True",
    "exsectionformat": "plain",

  });

  // 既定のオプションには * が付いています
  const wikires = await fetch(`https://ja.wikipedia.org/w/api.php?${query}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer',
  })

  res.status(200).json(await wikires.json())
}
