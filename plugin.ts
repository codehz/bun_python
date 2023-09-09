import { plugin } from "bun";
import { parse } from "path";
import python from "./index";

const { dir } = python.import("builtins");
const { SourceFileLoader } = python.import("importlib.machinery");

plugin({
  name: "python",
  target: "bun",
  setup(build) {
    // const { default: python } = await import("./index");
    build.onLoad({ filter: /\.(py)$/ }, ({ path }) => {
      const { name } = parse(path);
      const raw = SourceFileLoader(name, path).load_module();
      const exports = Object.fromEntries(
        dir(raw)
          .valueOf()
          .map((key: string) => [key, raw[key]])
      );
      return {
        loader: "object",
        exports,
      };
    });
  },
});
