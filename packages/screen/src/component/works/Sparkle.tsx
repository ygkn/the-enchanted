import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { createRef, RefObject, useEffect, useRef, useState, VFC } from "react";
import { Sprite, Vector2 } from "three";
import { getWordPointerPosition } from "../../coords";
import sparkleImageUrl from "../../images/sparkle.png";
import { nanoid } from "nanoid";

type Sparkle = {
  createdPosition: Vector2;
  createdAt: number;
};

export const Sparkle: VFC = () => {
  const spritesRef = useRef<Record<string, RefObject<Sprite>>>({});
  const [sparkles, setSparkles] = useState<Map<string, Sparkle>>(new Map());
  const map = useTexture(sparkleImageUrl);
  const three = useThree();

  for (const [sparkleId] of sparkles) {
    spritesRef.current[sparkleId] = createRef();
  }

  useFrame(() => {
    const now = performance.now();
    for (const [sparkleId, sparkle] of sparkles) {
      const sprite = spritesRef.current[sparkleId].current;
      if (sprite == null) {
        continue;
      }

      const elapsed = (now - sparkle.createdAt) / 500;

      const scaleRate = Math.max(0, 1 - (elapsed - 1) ** 2) * 2;

      sprite.scale.x = scaleRate;
      sprite.scale.y = scaleRate;
    }
  });

  useEffect(() => {
    setInterval(() => {
      const now = performance.now();
      const position = getWordPointerPosition(three.mouse, 10);
      position.x += Math.random() / 4;
      position.y += Math.random() / 4;
      setSparkles(
        (old) =>
          new Map([
            ...old,
            [nanoid(), { createdAt: now, createdPosition: position }],
          ])
      );
    }, 200);
  }, []);

  const now = performance.now();

  return (
    <>
      {Array.from(sparkles)
        .filter(([_, sparkle]) => now - sparkle.createdAt < 1000)
        .map(([sparkleId, sparkle]) => (
          <sprite
            key={sparkleId}
            ref={spritesRef.current[sparkleId]}
            position={[
              sparkle.createdPosition.x,
              sparkle.createdPosition.y,
              -10,
            ]}
          >
            <spriteMaterial map={map} />
          </sprite>
        ))}
    </>
  );
};
