import { useEffect, useRef ,useState} from 'react'
import { useKey } from 'react-use';

import type { NextPage } from 'next'
import * as THREE from 'three'




class Cube{
    mesh:THREE.Mesh
    id=0
    constructor(posX=240,posY=270){
        this.id=(new Date()).getTime()
        const geometry = new THREE.BoxGeometry(100, 100, 10)
        const material = new THREE.MeshStandardMaterial({
            map: (new THREE.TextureLoader()).load('/aaa.jpg'),
        })
        this.mesh=  new THREE.Mesh(geometry, material)
        this.mesh.position.x =posX
        this.mesh.position.y =posY
    }
    getMesh(){
       return this.mesh
    }

    hasStopped(){
        const me = new THREE.Box3().setFromObject(this.mesh)
        for(let cb of cubes){
            if(cb.id == this.id)
                continue
            const you = new THREE.Box3().setFromObject(cb.getMesh())
            if(me.intersectsBox(you))
                return true
        }
        return me.intersectsBox(new THREE.Box3().setFromObject(floor))
        
    }
    tickAction(){
        if(!this.hasStopped()){
             this.mesh.position.y -=2.5
        }
    }

}
let floor:THREE.Mesh
let cubes:Array<Cube> =[]
const Three: NextPage = () => {


let cubehatch:THREE.Mesh
   
    const mountRef = useRef<HTMLDivElement>(null)



    useKey('ArrowRight', ()=>cubehatch.position.x+=10);
    useKey('ArrowLeft', ()=>cubehatch.position.x-=10);
    useKey('ArrowUp', ()=>{});
    useKey('ArrowDown', ()=>{ });
    
    useEffect(() => {
        const w = 960
        const h = 540
        const scene = new THREE.Scene()
        const renderer = new THREE.WebGLRenderer()

        const elm = mountRef.current

        elm?.appendChild(renderer.domElement)
        renderer.physicallyCorrectLights = true;
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(w, h)

      
        scene.background = new THREE.Color( 0x404040 );

        //カメラ
        const camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000)
        camera.position.set(0, 0, 1000)


        //床
        floor=new THREE.Mesh(new THREE.BoxGeometry(2000, 10, 10), new THREE.MeshStandardMaterial({color:"red"}))
        floor. position.set(0,-400,0)
        scene.add(floor)
        //補助線
        // var axis = new THREE.AxesHelper(1000);
        // axis.position.set(0,0,0);
        // scene.add(axis);

        const directionalLight = new THREE.DirectionalLight(0xffffff,4)
        directionalLight.position.set(-100, 0, 100)
        scene.add(directionalLight)

        //発射口
        cubehatch=new THREE.Mesh(new THREE.BoxGeometry(100, 100, 10), new THREE.MeshStandardMaterial({color:"green"}))
        cubehatch.position.set(0,300,0)
        scene.add(cubehatch)



        //次のキューブ出す
        setInterval(()=>{
            let allStop=true
            for(const c of cubes){
                if(!c.hasStopped()){
                    allStop=false
                }
            }
            if(allStop){
                const c =new Cube(cubehatch.position.x,cubehatch.position.y)
                cubes.push(c)
                scene.add(c.getMesh())
                console.log(cubes)
            }
        }, 1000)


        const tick = () => {
            requestAnimationFrame(tick)
            for(const c of cubes){
                c.tickAction()
            }
            renderer.render(scene, camera)
            
        }

        tick()



        return () => {
            console.log("um")
            elm?.removeChild(renderer.domElement)
        }
    }, [])

    return (
        <>
        <div ref={mountRef} />
        </>
    )
    
}

export default Three

