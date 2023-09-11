import { expect, test } from "bun:test";
import { max } from "python:builtins";
import { hello } from "./test.py";

test("load builtins module", () => {
  expect(max(1, 2).valueOf()).toBe(2);
});

test("load py as module", () => {
  expect(hello("world").valueOf()).toBe("hello world");
});
