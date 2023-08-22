import { beforeAll, describe, expect, test } from "bun:test";

// import { assert, assertEquals, assertThrows } from "./deps.ts";
import {
  kw,
  NamedArgument,
  ProxiedPyObject,
  PyObject,
  python,
  PythonProxy,
} from "..";

const { version, executable } = python.import("sys");
console.log("Python version:", version.toString());
console.log("Executable:", executable.toString());

// test("python version", () => {
//   expect(String(version)).toMatch(/^\d+\.\d+\.\d+/);
// });

describe("types", async () => {
  test("bool", () => {
    const value = python.bool(true);
    expect(value.valueOf()).toBe(true);
  });

  test("int", () => {
    const value = python.int(42);
    expect(value.valueOf()).toBe(42);
  });

  test("float", () => {
    const value = python.float(42.0);
    expect(value.valueOf()).toBe(42.0);
  });

  test("str", () => {
    const value = python.str("hello");
    expect(value.valueOf()).toBe("hello");

    const unicode = python.str("'中文'");
    expect(unicode.valueOf()).toBe("'中文'");
  });

  test("list", () => {
    const value = python.list([1, 2, 3]);
    expect(value.valueOf()).toEqual([1, 2, 3]);
  });

  test("dict", () => {
    const value = python.dict({ a: 1, b: 2 });
    expect(value.valueOf()).toEqual(
      new Map([
        ["a", 1],
        ["b", 2],
      ])
    );
  });

  test("set", () => {
    let value = python.set([1, 2, 3]);
    expect(value.valueOf()).toEqual(new Set([1, 2, 3]));
    value = PyObject.from(new Set([1, 2, 3]));
    expect(value.valueOf()).toEqual(new Set([1, 2, 3]));
  });

  test("tuple", () => {
    const value = python.tuple([1, 2, 3]);
    expect(value.valueOf()).toEqual([1, 2, 3]);
  });
});

describe("object", () => {
  let person: any;
  beforeAll(() => {
    const { Person } = python.runModule(`
class Person:
  def __init__(self, name):
    self.name = name
  `);
    person = new Person("John");
  });

  test("get attr", () => {
    expect(person.name.valueOf()).toEqual("John");
  });

  test("set attr", () => {
    person.name = "Jane";
    expect(person.name.valueOf()).toEqual("Jane");
  });

  test("has attr", () => {
    expect(person).toHaveProperty("name");
  });

  test("dict item", () => {
    const dict = python.dict({ prop: "value" });
    expect(dict.prop.valueOf()).toBe("value");
  });

  test("dict set item", () => {
    const dict = python.dict({ prop: "value" });
    dict.prop = "new value";
    expect(dict.prop.valueOf()).toBe("new value");
  });

  test("dict delete item", () => {
    const dict = python.dict({ prop: "value" });
    delete dict.prop;
    expect(dict.prop).toBe(undefined);
  });

  test("dict has item", () => {
    const dict = python.dict({ prop: "value" });
    expect(dict).toHaveProperty("prop");
  });

  test("dict not has item", () => {
    const dict = python.dict({ prop: "value" });
    expect(dict).not.toHaveProperty("prop2");
  });

  test("list index", () => {
    const list = python.list([1, 2, 3]);
    expect(list[0].valueOf()).toBe(1);
  });

  test("list set index", () => {
    const list = python.list([1, 2, 3]);
    list[0] = 42;
    expect(list[0].valueOf()).toBe(42);
  });

  test("list iter", () => {
    const array = [1, 2, 3];
    const list = python.list(array);
    let i = 0;
    for (const v of list) {
      expect(v.valueOf()).toBe(array[i]);
      i++;
    }
  });
});

describe("named argument", () => {
  test("single named argument", () => {
    expect(
      python
        .str("Hello, {name}!")
        .format(kw`name=${"world"}`)
        .valueOf()
    ).toBe("Hello, world!");
  });

  test("combination of positional parameters and named argument", () => {
    const { Test } = python.runModule(`
class Test:
  def test(self, *args, **kwargs):
    return all([len(args) == 3, "name" in kwargs])
`);
    const t = new Test();

    const d = python.dict({ a: 1, b: 2 });
    const v = t.test(1, 2, new NamedArgument("name", "vampire"), d);
    expect(v.valueOf()).toBe(true);
  });
});

test("numpy", () => {
  const _np = python.import("numpy");
});

test("custom proxy", () => {
  const np = python.import("numpy");

  // We declare our own PythonProxy wrapper
  const CustomProxy = class implements PythonProxy {
    public readonly [ProxiedPyObject]: PyObject;

    constructor(array: PythonProxy) {
      this[ProxiedPyObject] = array[ProxiedPyObject];
    }
  };

  // Wrap the result in our custom wrapper
  const arr = new CustomProxy(np.array([1, 2, 3]));

  // Then, we use the wrapped proxy as if it were an original PyObject
  expect(np.add(arr, 2).tolist().valueOf()).toEqual([3, 4, 5]);
});

describe("slice", () => {
  test("get", () => {
    const list = python.list([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(list["1:"].valueOf()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    expect(list["1:2"].valueOf()).toEqual([2]);
    expect(list[":2"].valueOf()).toEqual([1, 2]);
    expect(list[":2:"].valueOf()).toEqual([1, 2]);
    expect(list["0:3:2"].valueOf()).toEqual([1, 3]);
    expect(list["-2:"].valueOf()).toEqual([8, 9]);
    expect(list["::2"].valueOf()).toEqual([1, 3, 5, 7, 9]);
  });

  test("set", () => {
    const np = python.import("numpy");
    let list = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    list["1:"] = -5;
    expect(list.tolist().valueOf()).toEqual([
      1, -5, -5, -5, -5, -5, -5, -5, -5,
    ]);

    list = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    list["1::3"] = -5;
    expect(list.tolist().valueOf()).toEqual([1, -5, 3, 4, -5, 6, 7, -5, 9]);

    list = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    list["1:2:3"] = -5;
    expect(list.tolist().valueOf()).toEqual([1, -5, 3, 4, 5, 6, 7, 8, 9]);
  });
});

describe("slice list", () => {
  const np = python.import("numpy");

  test("get", () => {
    const array = np.array([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    expect(array["0, :"].tolist().valueOf()).toEqual([1, 2, 3]);
    expect(array["1:, ::2"].tolist().valueOf()).toEqual([
      [4, 6],
      [7, 9],
    ]);
    expect(array["1:, 0"].tolist().valueOf()).toEqual([4, 7]);
  });

  test("set", () => {
    const array = np.arange(15).reshape(3, 5);
    array["1:, ::2"] = -99;
    expect(array.tolist().valueOf()).toEqual([
      [0, 1, 2, 3, 4],
      [-99, 6, -99, 8, -99],
      [-99, 11, -99, 13, -99],
    ]);
  });

  test("whitespaces", () => {
    const array = np.array([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    expect(array[" 1  :  , : :  2         "].tolist().valueOf()).toEqual([
      [4, 6],
      [7, 9],
    ]);
  });

  test("3d slicing", () => {
    const a3 = np.array([
      [
        [10, 11, 12],
        [13, 14, 15],
        [16, 17, 18],
      ],
      [
        [20, 21, 22],
        [23, 24, 25],
        [26, 27, 28],
      ],
      [
        [30, 31, 32],
        [33, 34, 35],
        [36, 37, 38],
      ],
    ]);

    expect(a3["0, :, 1"].tolist().valueOf()).toEqual([11, 14, 17]);
  });

  test("ellipsis", () => {
    const a4 = np.arange(16).reshape(2, 2, 2, 2);

    expect(a4["1, ..., 1"].tolist().valueOf()).toEqual([
      [9, 11],
      [13, 15],
    ]);
  });
});

test("async", () => {
  const { test } = python.runModule(
    `
async def test():
  return "ok"
  `,
    "async_test.py"
  );
  const aio = python.import("asyncio");
  expect(aio.run(test()).valueOf()).toBe("ok");
});

test("callback", () => {
  const { call } = python.runModule(
    `
def call(cb):
  return cb(61, reduce=1) + 1
  `,
    "cb_test.py"
  );
  const cb = python.callback((kw: { reduce: number }, num: number) => {
    return num - kw.reduce + 8;
  });
  expect(call(cb).valueOf()).toBe(69);
  cb.destroy();
});

describe("exceptions", () => {
  test("simple exception", () => {
    expect(() => python.runModule("1 / 0")).toThrow();
  });

  test("exception with traceback", () => {
    const np = python.import("numpy");
    const array = np.zeros([2, 3, 4]);
    expect(() => (array.shape = [3, 6])).toThrow();
  });
});
