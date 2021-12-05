import { useFrame } from "@react-three/fiber";
import { useRef, VFC } from "react";
import { Mesh } from "three";
import { getWordPointerPosition } from "../../coords";

export const Hoge: VFC = () => {
  const meshRef = useRef<Mesh>(null!);

  useFrame(({ mouse }) => {
    const pointerPosition = getWordPointerPosition(mouse, 10);
    meshRef.current.position.x = pointerPosition.x;
    meshRef.current.position.y = pointerPosition.y;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <meshStandardMaterial color="#fff" wireframe />
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};
