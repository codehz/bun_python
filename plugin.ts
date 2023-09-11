import { plugin } from "bun";
import { parse } from "path";
import python from "./index";

const { dir } = python.import("builtins");
const { SourceFileLoader } = python.import("importlib.machinery");

function convertExports(raw: any) {
  return Object.fromEntries(
    dir(raw)
      .valueOf()
      .map((key: string) => [key, raw[key]])
  )
}

plugin({
  name: "python",
  target: "bun",
  setup({ onResolve, onLoad }) {
    onResolve({ filter: /.+/, namespace: "python" }, ({ path }) => {
      return { path, namespace: "python" };
    });
    onLoad({ filter: /.+/, namespace: "python" }, ({ path }) => {
      const raw = python.import(path);
      const exports = convertExports(raw);
      return {
        loader: "object",
        exports,
      };
    })
    onLoad({ filter: /\.(py)$/ }, ({ path }) => {
      const { name } = parse(path);
      const raw = SourceFileLoader(name, path).load_module();
      const exports = convertExports(raw);
      return {
        loader: "object",
        exports,
      };
    });
  },
});
