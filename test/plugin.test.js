import { expect, test } from "bun:test";
import { hello } from "./test.py";

test("plugin", () => {
  expect(hello("world").valueOf()).toBe("hello world");
});
