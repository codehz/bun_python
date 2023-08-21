import { dlopen, Library } from 'bun:ffi';
import * as OS from 'node:os';
import { SYMBOLS } from './symbols';

const searchPath: string[] = [];

const SUPPORTED_VERSIONS = [[3, 11], [3, 10], [3, 9], [3, 8]];
const BUN_PYTHON_PATH = Bun.env['BUN_PYTHON_PATH']

const os = OS.type();

if (BUN_PYTHON_PATH) {
  searchPath.push(BUN_PYTHON_PATH);
} else {
  switch (os) {
    case "Windows":
    case "Linux":
      searchPath.push(
        ...SUPPORTED_VERSIONS.map(([major, minor]) =>
          `${os === "Linux" ? "lib" : ""}python${major}${os === "Linux" ? "." : ""
          }${minor}.${os === "Linux" ? "so" : "dll"}`
        ),
      );
      break;
    case "Darwin":
      for (
        const framework of [
          "/opt/homebrew/Frameworks/Python.framework/Versions",
          "/usr/local/Frameworks/Python.framework/Versions",
        ]
      ) {
        for (const [major, minor] of SUPPORTED_VERSIONS) {
          searchPath.push(`${framework}/${major}.${minor}/Python`);
        }
      }
      break;
    default:
      throw new Error(`Unsupported OS: ${os}`);
  }
}

let py!: Library<SYMBOLS>["symbols"]

for (const path of searchPath) {
  try {
    py = dlopen(path, SYMBOLS).symbols as any;
    break;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(
        "Cannot load dynamic library because --unstable flag was not set",
      );
    }
    continue;
  }
}

const LIBRARY_NOT_FOUND = new Error(`
Could not find Python library!

Tried searching for these versions:
${searchPath.map((e) => "  " + e).join("\n")}

Make sure you have a supported version of Python
installed on your system, which should be one of
these: ${SUPPORTED_VERSIONS.map((e) => `${e[0]}.${e[1]}`).join(", ")}

If the module still somehow fails to find it,
you can open an issue: https://github.com/codehz/bun_python/issues

However, if your Python distribution is not in search
path, you can set BUN_PYTHON_PATH env variable pointing
to dll/dylib/so file for Python library.
`);

if (typeof py !== "object") {
  throw LIBRARY_NOT_FOUND;
}

export { py };
