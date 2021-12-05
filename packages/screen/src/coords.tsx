import {
  createContext,
  FC,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";

type Vector2d = { x: number; y: number };

type Orientation = {
  alpha: number;
  beta: number;
  gamma: number;
};

type MessageObject =
  | {
      type: "orientation";
      uid: string;
      payload: Orientation;
    }
  | {
      type: "disconnect";
      uid: string;
    };

function getTanDeg(deg: number) {
  return Math.tan((deg * Math.PI) / 180);
}

const coordsContext = createContext<{
  clientsRef: RefObject<Vector2d>;
  debugRef: RefObject<Vector2d>;
  debuggingRef: RefObject<boolean>;
} | null>(null);

export const CoordsProvider: FC = ({ children }) => {
  const clientsRef = useRef<Vector2d>({ x: 0, y: 0 });
  const debugRef = useRef<Vector2d>({ x: 0, y: 0 });
  const debuggingRef = useRef<boolean>(false);

  useEffect(() => {
    const socket = new WebSocket(`wss://${location.hostname}:8080`);

    socket.addEventListener("open", function () {
      console.log("connect");
      socket.send(
        JSON.stringify({
          type: "listen",
        })
      );
    });

    socket.addEventListener("message", async (event) => {
      const text =
        typeof event.data === "string" ? event.data : await event.data.text();
      const jsonObject: MessageObject = JSON.parse(text);

      console.log(jsonObject);

      if (jsonObject.type === "orientation") {
        clientsRef.current = {
          x: -4 * getTanDeg(jsonObject.payload.alpha),
          y: 4 * getTanDeg(jsonObject.payload.beta),
        };
      }
      if (jsonObject.type === "disconnect") {
        clientsRef.current = { x: 0, y: 0 };
      }
    });

    document.addEventListener("mousemove", (event) => {
      debugRef.current = {
        x: event.offsetX,
        y: event.offsetX,
      };
    });

    document.addEventListener("keydown", (event) => {
      if (event.key.toUpperCase() === "D") {
        debuggingRef.current = !debuggingRef.current;
      }
    });
  }, []);

  return (
    <coordsContext.Provider value={{ clientsRef, debugRef, debuggingRef }}>
      {children}
    </coordsContext.Provider>
  );
};

export const useCoords = (): (() => Vector2d) => {
  const contextValue = useContext(coordsContext);

  return () => {
    if (contextValue === null) {
      return { x: 0, y: 0 };
    }

    if (contextValue.debuggingRef.current) {
      contextValue.debugRef.current!;
    }

    return contextValue.clientsRef.current!;
  };
};
