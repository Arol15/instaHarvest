import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import orange from "./orange.gltf";
import { useLoader } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";

const OrangeObj = (props) => {
  const group = useRef();
  const { nodes, materials } = useLoader(GLTFLoader, orange);

  useFrame(() => {
    group.current.rotation.y += 0.01;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.path5169.geometry}
        material={materials["SVGMat.006"]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[30, 30, 30]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.path5287.geometry}
        material={materials["SVGMat.007"]}
        position={[0.07, 0.28, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[30, 30, 30]}
      />
    </group>
  );
};

export default OrangeObj;
