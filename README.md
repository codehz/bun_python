# bun_python

This module provides a seamless integration between bun and python by integrating with the Python/C API. It acts as a bridge between the two languages, enabling you to pass data and execute python code from within your bun applications. This enables access to the large and wonderful python ecosystem while remaining native (unlike a runtime like the wondeful pyodide which is compiled to wasm, sandboxed and may not work with all python packages) and simply using the existing python installation.

## Example

Import any locally installed Python package, for example, `matplotlib`:

```ts
import { python } from "bun_python";

const np = python.import("numpy");
const plt = python.import("matplotlib.pyplot");

const xpoints = np.array([1, 8]);
const ypoints = np.array([3, 10]);

plt.plot(xpoints, ypoints);
plt.show();
```

Run this code:

```shell
bun run <file>
```

## Example for using bun plugin (aka, import from python:*)

Since Bun provides a plugin API, it can extend the import behavior at runtime. We have also made a bun plugin for it, which allows you to import python modules using something like `import * as np from "python:numpy"`.
Unfortunately, there is currently no way to directly make the bun use the preload script from npm, so you have to manually create a preload script to load the python plugin.

Setup:

Create a file named preload.ts:
```typescript
import "bun_python/plugin.ts"
```

Setup bunfig.toml
```typescript
preload = ["./preload.ts"]
```
(Or you could use `bun run -r ./preload.ts demo.ts`)

Demo code:
```typescript
import * as np from 'python:numpy';
import * as plt from 'python:matplotlib.pyplot';

const xpoints = np.array([1, 8]);
const ypoints = np.array([3, 10]);

plt.plot(xpoints, ypoints);
plt.show();
```

## Python Installation

This module uses FFI to interface with the Python interpreter's C API. So you must have an existing Python installation (with the shared library), which is something like python310.dll, etc.

Python installed from Microsoft Store does not work, as it does not contain shared library for interfacing with Python interpreter.

If the module fails to find Python, you can add the path to the Python in the BUN_PYTHON_PATH environment variable.

BUN_PYTHON_PATH if set, must point to full path including the file name of the Python dynamic library, which is like python310.dll (Windows), libpython310.dylib (macOS) and libpython310.so (Linux) depending on platform.

## Maintainers

* CodeHz ([@codehz](https://github.com/codehz))

## Other

### Contribution
Pull request, issues and feedback are very welcome. Code style is formatted with prettier.

### LICENSE
Copyright for portions of project bun_python are held by DjDeveloperr, 2021 and the Denosaurs team, 2023 as part of project deno_python. All other copyright for project bun_python are held by CodeHz, 2023. MIT license.