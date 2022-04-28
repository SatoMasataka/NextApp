import { useEffect, useRef } from 'react'

import type { NextPage } from 'next'
import * as THREE from 'three'

const Three: NextPage = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const w = 960
        const h = 540

        const renderer = new THREE.WebGLRenderer()

        const elm = mountRef.current

        elm?.appendChild(renderer.domElement)

        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(w, h)

        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000)
        camera.position.set(0, 0, +1000)

        const geometry = new THREE.BoxGeometry(1000, 100, 100, 100, 100, 1) // SphereGeometry(300, 30, 30)

        const material = new THREE.MeshStandardMaterial({
            map: (new THREE.TextureLoader()).load('/aaa.jpg'),
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        const mesh2 = new THREE.Mesh(geometry, material)
        scene.add(mesh2)

        const directionalLight = new THREE.DirectionalLight(0xffffff)
        directionalLight.position.set(1, 1, 1)

        scene.add(directionalLight)

        const tick = () => {

            mesh.rotation.x += 0.01
            mesh.position.y += 1
            mesh.scale.y += 0.1

            mesh2.position.x += 1
            mesh2.rotation.y += 0.01

            renderer.render(scene, camera)

            requestAnimationFrame(tick)
        }

        tick()

        return () => {
            elm?.removeChild(renderer.domElement)
        }
    }, [])

    return (
        <div ref={mountRef} />
    )
}

export default Three

