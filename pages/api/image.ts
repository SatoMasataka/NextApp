import type { NextApiRequest, NextApiResponse } from 'next'
import { JSDOM } from 'jsdom'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const query = new URLSearchParams({
    "p": req.query.p
  });


  const imageSearch = await fetch(`https://search.yahoo.co.jp/image/search?${new URLSearchParams(query)}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer',
  })

  const dom = new JSDOM(await imageSearch.text())
  const imgJson = JSON.parse(dom.window.document.querySelector("#__NEXT_DATA__").textContent)
  res.status(200).json({ imgs: imgJson.props.initialProps.pageProps.algos.map((i) => i.imageSrc) })
}
