import { useState } from 'react'
import { Card } from 'components/Card'

const CardDas = () => {
  const [cards, setCards] = useState({})
  const clk = async () => {
    const res = await fetch('http://localhost:3000/api/card')
    const _res = await res.json()
    setCards(_res.query.pages)

  }
  return <div>
    <button onClick={clk}>GetCard</button>
    {Object.keys(cards).map(id => {
      return (
        <Card id={id} title={cards[id].title} extract={cards[id].extract}></Card>
      )
    })}

  </div >

}

export default CardDas
