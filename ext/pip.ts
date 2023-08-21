import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { PythonError, kw, python } from "..";

const sys = python.import("sys");
const runpy = python.import("runpy");

// https://packaging.python.org/en/latest/specifications/name-normalization/
const MODULE_REGEX =
  /^([a-z0-9]|[a-z0-9][a-z0-9._-]*[a-z0-9])([^a-z0-9._-].*)?$/i;

function normalizeModuleName(name: string) {
  return name.replaceAll(/[-_.]+/g, "-").toLowerCase();
}

function getModuleNameAndVersion(module: string): {
  normalized: string;
  name: string;
  version?: string;
} {
  const match = module.match(MODULE_REGEX);
  const name = match?.[1];
  const version = match?.[2];

  if (name == null) {
    throw new TypeError("Could not match any valid pip module name");
  }

  return {
    normalized: normalizeModuleName(name),
    name,
    version,
  };
}

function findBaseDir() {
  let path = dirname(Bun.main);
  while (!existsSync(join(path, "package.json"))) {
    if (path === '/') {
      return dirname(Bun.main);
    }
    path = dirname(path);
  }
  return path;
}

export class Pip {
  constructor(public location: string = join(findBaseDir(), 'pip_packages')) {
    sys.path.insert(1, this.location);
  }

  /**
   * Install a Python module using the `pip` package manager.
   *
   * @param module The Python module which you wish to install
   */
  async install(module: string) {
    const argv = sys.argv;
    sys.argv = [
      "pip",
      "install",
      "-q",
      "--upgrade",
      "-t",
      this.location,
      module,
    ];

    console.log(`[pip] Installing ${module}`);

    try {
      runpy.run_module("pip", kw`run_name=${"__main__"}`);
    } catch (error) {
      if (
        !(
          error instanceof PythonError &&
          error.type.isInstance(python.builtins.SystemExit()) &&
          error.value.asLong() === 0
        )
      ) {
        throw error;
      }
    } finally {
      sys.argv = argv;
    }
  }

  /**
   * Install and import a Python module using the `pip` package manager.
   *
   * @param module The Python module which you wish to install
   */
  async import(module: string, entrypoint?: string) {
    const { name } = getModuleNameAndVersion(module);
    entrypoint ??= name;

    if (!existsSync(join(this.location, entrypoint)))
      await this.install(module);

    return python.import(entrypoint);
  }
}

const pip = new Pip();
export default pip;