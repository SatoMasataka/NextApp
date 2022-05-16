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
  getBlocks: CallableFunction,
  rotate: CallableFunction
}
type gameStatuses = {
  hasEnd: boolean,
  score: number,
  message: string,
  isHighSpeed:boolean
}

abstract class TmBlockHandler {
  protected rotateNum = 0
  abstract color: string
  getBlocks(pos: position): block[] {
    let blks = []
    let brps=this.getBlocksRerativPos()
    if(this.rotateNum%4==1 )
      brps=brps.map((p)=>{return{x:p.y,y:-p.x}})
    if(this.rotateNum%4==2 )
      brps=brps.map((p)=>{return{x:-p.x,y:-p.y}})
    if(this.rotateNum%4==3 )
      brps=brps.map((p)=>{return{x:-p.y,y:p.x}})  

    for (const rp of brps) {
      blks.push({
        position: { x: pos.x + rp.x, y: pos.y + rp.y },
        color: this.color,
        down: function () {
          this.position = { ...this.position, y: this.position.y + 1 }
          return this
        }
      })
    }
    return blks
  }
  abstract getBlocksRerativPos(): position[]
  rotate(num:number) { this.rotateNum+=num }
}
class TmBlockHandler_L extends TmBlockHandler {
  color = "pink"
  getBlocksRerativPos(): position[] {
    return [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
  }
}
class TmBlockHandler_O extends TmBlockHandler {
  color = "green"
  getBlocksRerativPos(): position[] {
    return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
  }
}
class TmBlockHandler_Z extends TmBlockHandler {
  color = "blue"
  getBlocksRerativPos(): position[] {
    return [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
  }
}
class TmBlockHandler_S extends TmBlockHandler {
  color = "red"
  getBlocksRerativPos(): position[] {
    return [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
  }
}
class TmBlockHandler_I extends TmBlockHandler {
  color = "orange"
  getBlocksRerativPos(): position[] {
    return [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
  }
}

const Teto = () => {
  const [stackedBlocks, setStackedBlocks] = useState<block[]>([])
  const [currentTetorimino, setCurrentTetorimino] = useState<tetorimino | null>(null)
  const currentTetorimino_L = useLatest<tetorimino | null>(currentTetorimino)
  const stackedBlocks_L = useLatest(stackedBlocks)


  const [gameStatuses, setgameStatuses] = useState<gameStatuses>({
    score: 0,
    hasEnd: true,
    message: "",
    isHighSpeed:false
  })
  const gameStatuses_L = useLatest(gameStatuses)

  /**
   * テトリミノObjectを新規で生成
   * @param pos 
   * @returns 
   */
  const generateTetorimino = (pos: position): tetorimino => {
    const blkHandlers = [new TmBlockHandler_I(), new TmBlockHandler_L(), new TmBlockHandler_O()
      , new TmBlockHandler_S(), new TmBlockHandler_Z()]
    const f: TmBlockHandler = blkHandlers[Math.floor(Math.random()*blkHandlers.length)]
    
    return {
      basePosition: pos,
      hasLanded: false,

      getBlocks: function () {
        return f.getBlocks(this.basePosition)
      },
      rotate:function(){
        //ちょっっと手抜き。回転させてみて入っていけないところにブロックが入ったら回転取り消し
        f.rotate(1)
        if(!this.canGo(0,0))
          f.rotate(-1)
        return this
      },

      canGo: function (mvX: number, mvY: number): boolean {
        //移動後に位置がダブるブロックがあればNG
        const afterMoved: position[] = this.getBlocks().map(b => { return { x: b.position.x + mvX, y: b.position.y + mvY } })
        const stacked = stackedBlocks_L.current.map(s => s.position)
        const isNotDuplicate = afterMoved.filter(mvd => stacked.filter(std => (std.x == mvd.x && std.y == mvd.y)).length > 0).length < 1

        //移動後にフレームの外に出てしまうブロックがあればNG
        let isNotOnFrame = Math.max(...afterMoved.map(bp => bp.y)) <= frameH 
            && Math.max(...afterMoved.map(bp => bp.x)) <= frameW
            && Math.min(...afterMoved.map(bp => bp.x)) > 0

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
  useKey('ArrowRight', () => moveTetorimino(1))
  useKey('ArrowLeft', () => moveTetorimino(-1))
  useKey('ArrowDown', () => setgameStatuses({...gameStatuses_L.current,isHighSpeed:true}),{event:"keydown"})
  useKey('ArrowDown', () => setgameStatuses({...gameStatuses_L.current,isHighSpeed:false}),{event:"keyup"})
  useKey('ArrowUp', () => setCurrentTetorimino(currentTetorimino_L.current?.rotate()??currentTetorimino_L.current))
 
  const startGame = () => {
    setgameStatuses({message:"",isHighSpeed:false,score:0, hasEnd: false })
    setCurrentTetorimino(null)
    setStackedBlocks([])

    let counter = 0
    let gameTimer = setInterval(() => {
      if(gameStatuses_L.current.isHighSpeed || counter %5===0)
          moveTetorimino(0, 1) //落下

      ////currentTetorimino　を参照すると、関数作成時の状態が取得されるので
      if (currentTetorimino_L.current === null) {
        //テトリミノがない状態:追加
        const newMino = generateTetorimino({ x: frameW / 2, y: 1 })
        setCurrentTetorimino(newMino)
        if (!newMino.canGo(0, 0)) { //ゲームオーバー
          setCurrentTetorimino(null)
          setgameStatuses({ ...gameStatuses_L.current, hasEnd: true, message: "GAME OVER" })
        }
      } else if (currentTetorimino_L.current?.hasLanded) {
        //テトリミノが着地した時
        const blk = currentTetorimino_L.current.getBlocks()
        const _curr = stackedBlocks_L.current
        setCurrentTetorimino(null)

        //揃った判定
        let curr = _curr.concat(blk)
        let deleteRowNum = 0
        for (let i = 1; i <= frameH; i++) {
          if (curr.filter(blk => blk.position.y === i).length >= frameW) {
            curr = curr.filter(blk => blk.position.y !== i).map(blk => blk.position.y < i ? blk.down() : blk)
            deleteRowNum++
          }
        }
        setStackedBlocks(curr)
        setgameStatuses({ ...gameStatuses_L.current, score: gameStatuses_L.current.score + deleteRowNum * 10 })
      }
      if (gameStatuses_L.current.hasEnd) {
        clearInterval(gameTimer)
      }
      counter++
    }, 100)

  }

  return <>
    <div className={TetoModule.tetoWrapper}
      style={{ display: "grid", gridTemplateColumns: "5vh ".repeat(frameW), gridTemplateRows: "5vh ".repeat(frameH) }}>

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
    {(()=> gameStatuses_L.current.hasEnd? <button onClick={startGame}>Start</button>:<></>)()}
   
  </>

}

export default Teto
