import { python } from "..";

const count = 100_000_000;

console.time("js for-loop");
for (let i = 0; i < count; i++) {}
console.timeEnd("js for-loop");

console.time("python for-loop in js");
for (const _ of python.builtins.range(0, count)) {
}
console.timeEnd("python for-loop in js");

console.log("python for-loop in cProfile");
python.import("cProfile").run(`
for i in range(1, ${count}):
  pass
`);
