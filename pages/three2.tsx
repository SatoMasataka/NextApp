import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const Box = (props) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    ref.current.rotation.x += 0.1;
    ref.current.rotation.y += 0.1;
  }, );

  return (
    <mesh
    {...props}
      ref={ref}
 
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
    
      <boxBufferGeometry args={isHovered ? [1.2, 1.2, 1.2] : [2, 1, 1]} />
      <meshLambertMaterial color={isHovered ? 0x44c2b5 : 0x9178e6} />
    </mesh>
  );
};

export default function App() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh"}}>
        <Canvas dpr={2}>
        <color attach="background" args={[0xf5f3fd]} />
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.5} position={[-10, 10, 10]} />
        <Box position={[1, 1, 1]} scale={0.5}/>
        <Box position={[0, 0, 1]} scale={1}/>
        </Canvas>
    </div>
  );
}