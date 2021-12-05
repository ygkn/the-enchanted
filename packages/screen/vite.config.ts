import { UserConfigExport } from "vite";
import path from "path";
import devcert from "devcert";
import reactJsx from "vite-react-jsx";

export default async (): Promise<UserConfigExport> => {
  const { key, cert } = await devcert.certificateFor("localhost");

  return {
    plugins: [reactJsx()],
    resolve: {
      alias: {
        "@/": path.join(__dirname, "./src/"),
      },
    },
    server: {
      open: true,
      https: {
        key,
        cert,
      },
    },
  };
};
