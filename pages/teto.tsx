import { useEffect, useState, useCallback } from 'react'
import TetoModule from '../styles/Teto.module.css'
import { useKey, useLatest } from 'react-use';
type position = { x: number, y: number }

const [frameH, frameW] = [15, 8]
type block = {
  position: position,
  color: string,
  down: CallableFunction
}
type tetorimino = {
  basePosition: position,
  hasLanded: boolean,
  canGo: CallableFunction,
  getBlocks: CallableFunction
}
type gameStatuses = {
  hasEnd: boolean,
  score: number,
  message: string
}

const generateBlock=(p: position, color = "red"):block =>{
  return {
    position: p,
    color: color,
    down: function () {
      this.position = { ...this.position, y: this.position.y + 1 }
      return this
    }
  }
}

//getBlocks
//rotate


const Teto = () => {
  const [stackedBlocks, setStackedBlocks] = useState<block[]>([])
  const [currentTetorimino, setCurrentTetorimino] = useState<tetorimino | null>(null)
  const currentTetorimino_L = useLatest<tetorimino | null>(currentTetorimino)
  const stackedBlocks_L = useLatest(stackedBlocks)


  const [gameStatuses, setgameStatuses] = useState<gameStatuses>({
    score: 0,
    hasEnd: false,
    message: ""
  })
  const gameStatuses_L = useLatest(gameStatuses)

  /**
   * テトリミノObjectを新規で生成
   * @param pos 
   * @returns 
   */
  const generateTetorimino=(pos: position): tetorimino =>{
    return {
      basePosition: pos,
      hasLanded: false,

      getBlocks: function () {
        return [generateBlock(this.basePosition)
          , generateBlock({ ...this.basePosition, y: this.basePosition.y + 1 })
          , generateBlock({ ...this.basePosition, y: this.basePosition.y - 1 })
          , generateBlock({ ...this.basePosition, x: this.basePosition.x + 1 })
          , generateBlock({ ...this.basePosition, x: this.basePosition.x + 2 })
          , generateBlock({ ...this.basePosition, x: this.basePosition.x + 3 })
        ]
      },

      canGo: function (mvX: number, mvY: number): boolean {
        const stackedBlocks = stackedBlocks_L.current
        //移動後に位置がダブるブロックがあればNG
        const afterMoved: position[] = this.getBlocks().map(b => { return { x: b.position.x + mvX, y: b.position.y + mvY } })
        const stacked = stackedBlocks.map(s => s.position)
        const isNotDuplicate = afterMoved.filter(mvd => stacked.filter(std => (std.x == mvd.x && std.y == mvd.y)).length > 0).length < 1

        //移動後にフレームの外に出てしまうブロックがあればNG
        let isNotOnFrame = true
        if (mvY != 0)
          isNotOnFrame = Math.max(...afterMoved.map(bp => bp.y)) <= frameH
        else if (mvX > 0)
          isNotOnFrame = Math.max(...afterMoved.map(bp => bp.x)) <= frameW
        else if (mvX < 0)
          isNotOnFrame = Math.min(...afterMoved.map(bp => bp.x)) > 0

        return isNotDuplicate && isNotOnFrame
      }
    }
  }


  const moveTetorimino = (mvX = 0, mvY = 0) => {
    setCurrentTetorimino((a) => {
      if (!a?.canGo(mvX, mvY))
        return mvY > 0 ? { ...a, hasLanded: true } : a //下移動できなくなった場合に着地ステータスを変えてやる

      return { ...a, basePosition: { x: a.basePosition.x + mvX, y: a.basePosition.y + mvY } }
    })
  }

  //コントローラー
  useKey('ArrowRight', () => moveTetorimino(1));
  useKey('ArrowLeft', () => moveTetorimino(-1));


  const wrapStyle = {
    display: "grid",
    gridTemplateColumns: "5vh ".repeat(frameW),
    gridTemplateRows: "5vh ".repeat(frameH),
  }


  const startGame = () => {
    let gameTimer = setInterval(() => {
      moveTetorimino(0, 1) //落下

      ////currentTetorimino　を参照すると、関数作成時の状態が取得されるので
      if (currentTetorimino_L.current === null) {
        //テトリミノがない状態に追加
        const newMino = generateTetorimino({ x: frameW / 2, y: 1 })
        setCurrentTetorimino(newMino)
        if (!newMino.canGo(0, 0)) { //ゲームオーバー
          setgameStatuses({ ...gameStatuses, hasEnd: true, message: "GAME OVER" })
        }
      } else if (currentTetorimino_L.current?.hasLanded) {
        //テトリミノが着地した時
        const blk = currentTetorimino_L.current.getBlocks()
        const _curr = stackedBlocks_L.current
        setCurrentTetorimino(null)

        //揃った判定
        let curr = _curr.concat(blk)
        for (let i = 1; i <= frameH; i++) {
          if (curr.filter(blk => blk.position.y === i).length >= frameW) {
            curr = curr.filter(blk => blk.position.y !== i).map(blk => blk.position.y < i ? blk.down() : blk)
            setgameStatuses({ ...gameStatuses, score: gameStatuses_L.current.score + 10 })
          }
        }
        setStackedBlocks(curr)
      }
      if (gameStatuses_L.current.hasEnd) {
        clearInterval(gameTimer)
      }
    }, 500)

  }

  return <>
    <button onClick={startGame}>Start</button>
    {/* <button onClick={() => { setgameStatuses({...gameStatuses,hasEnd:true}) }}>Pose</button> */}
    {currentTetorimino?.basePosition.x} {currentTetorimino?.basePosition.y}  {currentTetorimino?.hasLanded ? 1 : 0}
    <div className={TetoModule.tetoWrapper} style={wrapStyle}>

      {(() => {
        //ブロックが存在しているマスに色付け
        const blocks = stackedBlocks.concat(currentTetorimino?.getBlocks() ?? [])

        const grids = []
        for (let y = 1; y <= frameH; y++) {
          for (let x = 1; x <= frameW; x++) {
            const targetCell = blocks.filter(blk => blk.position.x == x && blk.position.y == y)
            const gridStyle = targetCell.length > 0 ? { backgroundColor: targetCell[0].color } : {}
            grids.push(<div style={gridStyle} className={`${TetoModule.grid}`} ></div>)
          }
        }
        return grids

      })()}
    </div>
    <h2>スコア：{gameStatuses.score}</h2>
    <h2>{gameStatuses.message}</h2>
  </>

}

export default Teto
