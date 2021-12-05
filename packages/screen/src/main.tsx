import * as THREE from "three";
import ReactDOM from "react-dom";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, PerspectiveCamera } from "@react-three/drei";

const socket = new WebSocket(`wss://the-enchanted-server.herokuapp.com`);

type Orientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

function getTanDeg(deg: number) {
  return Math.tan((deg * Math.PI) / 180);
}

let deviceOrientation: Orientation = { alpha: 0, beta: 0, gamma: 0 };

socket.addEventListener("open", function () {
  console.log("connect");
  socket.send(
    JSON.stringify({
      type: "listen",
    })
  );
});

socket.addEventListener("message", async function (event) {
  deviceOrientation = JSON.parse(await event.data.text()).payload;
  console.log(deviceOrientation);
});

function Box() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    mesh.current.position.x = -4 * getTanDeg(deviceOrientation.alpha);
    mesh.current.position.y = 4 * getTanDeg(deviceOrientation.beta);
  });

  return (
    <PerspectiveCamera args={[45]} makeDefault position={[0, 0, 0]}>
      <Icosahedron ref={mesh} position={[0, 0, -10]}>
        <meshStandardMaterial color="#fff" wireframe />
      </Icosahedron>
    </PerspectiveCamera>
  );
}

ReactDOM.render(
  <Canvas>
    <ambientLight />
    <Box />
  </Canvas>,
  document.getElementById("root")
);
