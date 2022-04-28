import Image from 'next/image'
import React, { useState, useEffect } from 'react';

type CardProps = {
  title: string,
  extract: string,
  id: string
}

export const Card = (props: CardProps) => {
  const [img, changeImg] = useState("")
  useEffect(() => {
    const f = async () => {
      const query = new URLSearchParams({
        p: props.title
      });

      const res = await fetch(`http://localhost:3000/api/image?${query}`)
      const img = (await res.json()).imgs[0]

      changeImg(img)
    }
    f()
  }, [img]);


  return <div>
    <img src={img}></img>
    {props.title} | {props.extract}
  </div>
}
