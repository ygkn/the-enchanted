const messagePleasingWhenDeny = [
  "遊ぶには許可してください🥺",
  "（リロードしてください）",
].join("\n");

/**
 * for iOS Safari 13+
 */
export const requestPermission = async () => {
  if (
    DeviceMotionEvent &&
    // @ts-expect-error
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // @ts-expect-error
    const permission = await DeviceMotionEvent.requestPermission();
    if (permission === "denied") {
      alert(messagePleasingWhenDeny);
    }
  }

  if (
    DeviceOrientationEvent &&
    // @ts-expect-error
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    // @ts-expect-error
    const permission = await DeviceOrientationEvent.requestPermission();
    if (permission === "denied") {
      alert(messagePleasingWhenDeny);
    }
  }
};
