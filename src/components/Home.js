import { useRef, useState, Suspense } from "react";

import ShareProducts from "./ShareProducts";
import SearchMain from "./product/SearchMain";

import { Canvas } from "@react-three/fiber";
import OrangeObj from "../assets/objects/OrangeObj";

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to instaHarvest</h1>
      <SearchMain />
      <ShareProducts />

      <Canvas concurent>
        <ambientLight intensity={0.5} />
        <pointLight intensity={0.3} position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <OrangeObj position={[0, 0, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
