import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState, VFC } from "react";
import { Hoge } from "./works/Hoge";
import { Pointer } from "./works/Pointer";

const Works = [Pointer, Hoge];

export const WorkSwitcher: VFC = () => {
  const [workIndex, setWorkIndex] = useState<number>(0);

  const WorkComponent = Works[workIndex];

  const goNext = () => {
    setWorkIndex((current) => (current + 1) % Works.length);
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        goNext();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <Canvas>
      <ambientLight />
      <PerspectiveCamera args={[45]} makeDefault position={[0, 0, 0]}>
        <WorkComponent />
      </PerspectiveCamera>
    </Canvas>
  );
};
