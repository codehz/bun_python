import { python } from "..";

const { print, str } = python.builtins;
const { version } = python.import("sys");

print(str("Hello, World!").lower());
print(`Python version: ${version}, Bun version: ${Bun.version}`);
