import { FFIType } from "bun:ffi";
import { type } from "node:os";

export type SYMBOLS = typeof SYMBOLS;

const INT = FFIType.i32;
const LONG =
  type() === "Windows" ? (FFIType.i32 as const) : (FFIType.i64_fast as const);
const LONGLONG = FFIType.i64_fast as const;
const SSIZE_T = FFIType.i64_fast;

export const LONG_MINIMUM =
  type() === "Windows" ? -2_147_483_648n : -9_223_372_036_854_775_808n;
export const LONG_MAXIMUM =
  type() === "Windows" ? 2_147_483_647n : 9_223_372_036_854_775_807n;

export const SYMBOLS = {
  Py_Initialize: {
    args: [],
    returns: FFIType.void,
  },

  Py_IncRef: {
    args: [FFIType.pointer],
    returns: FFIType.void,
  },

  Py_DecRef: {
    args: [FFIType.pointer],
    returns: FFIType.void,
  },

  PyImport_ImportModule: {
    args: [FFIType.cstring],
    returns: FFIType.pointer,
  },

  PyEval_GetBuiltins: {
    args: [],
    returns: FFIType.pointer,
  },

  PyRun_SimpleString: {
    args: [FFIType.cstring],
    returns: INT,
  },

  PyErr_Occurred: {
    args: [],
    returns: FFIType.pointer,
  },

  PyErr_Clear: {
    args: [],
    returns: FFIType.void,
  },

  PyErr_Fetch: {
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: FFIType.void,
  },

  PyDict_New: {
    args: [],
    returns: FFIType.pointer,
  },

  PyDict_SetItemString: {
    args: [FFIType.pointer, FFIType.cstring, FFIType.pointer],
    returns: INT,
  },

  PyObject_GetItem: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyObject_SetItem: {
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: INT,
  },

  PyObject_Call: {
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyObject_GetAttrString: {
    args: [FFIType.pointer, FFIType.cstring],
    returns: FFIType.pointer,
  },

  PyObject_SetAttrString: {
    args: [FFIType.pointer, FFIType.cstring, FFIType.pointer],
    returns: INT,
  },

  PyObject_HasAttrString: {
    args: [FFIType.pointer, FFIType.cstring],
    returns: INT,
  },

  PyObject_DelAttrString: {
    args: [FFIType.pointer, FFIType.cstring],
    returns: INT,
  },

  PySlice_New: {
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyTuple_New: {
    args: [SSIZE_T],
    returns: FFIType.pointer,
  },

  PyTuple_SetItem: {
    args: [FFIType.pointer, SSIZE_T, FFIType.pointer],
    returns: INT,
  },

  PyObject_RichCompare: {
    args: [FFIType.pointer, FFIType.pointer, INT],
    returns: FFIType.pointer,
  },

  PyObject_RichCompareBool: {
    args: [FFIType.pointer, FFIType.pointer, INT],
    returns: INT,
  },

  PyDict_Next: {
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: INT,
  },

  PyDict_SetItem: {
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: INT,
  },

  PyDict_DelItemString: {
    args: [FFIType.pointer, FFIType.cstring],
    returns: INT,
  },

  PyIter_Next: {
    args: [FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyObject_GetIter: {
    args: [FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyList_New: {
    args: [SSIZE_T],
    returns: FFIType.pointer,
  },

  PyList_SetItem: {
    args: [FFIType.pointer, SSIZE_T, FFIType.pointer],
    returns: INT,
  },

  PyBool_FromLong: {
    args: [LONG],
    returns: FFIType.pointer,
  },

  PyFloat_AsDouble: {
    args: [FFIType.pointer],
    returns: FFIType.f64,
  },

  PyFloat_FromDouble: {
    args: [FFIType.f64],
    returns: FFIType.pointer,
  },

  PyLong_AsLong: {
    args: [FFIType.pointer],
    returns: LONG,
  },

  PyLong_FromString: {
    args: [FFIType.cstring, FFIType.pointer, INT],
    returns: FFIType.pointer,
  },

  PyLong_FromLong: {
    args: [LONG],
    returns: FFIType.pointer,
  },

  PyLong_AsLongLongAndOverflow: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: LONGLONG,
  },

  PyUnicode_AsUTF8: {
    args: [FFIType.pointer],
    returns: FFIType.cstring,
  },

  PyUnicode_DecodeUTF8: {
    args: [FFIType.pointer, SSIZE_T, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyList_Size: {
    args: [FFIType.pointer],
    returns: SSIZE_T,
  },

  PyList_GetItem: {
    args: [FFIType.pointer, SSIZE_T],
    returns: FFIType.pointer,
  },

  PyObject_Type: {
    args: [FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyObject_Str: {
    args: [FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyDict_Keys: {
    args: [FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyDict_GetItem: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PySet_New: {
    args: [FFIType.pointer],
    returns: FFIType.pointer,
  },

  PySet_Add: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: INT,
  },

  PyImport_ExecCodeModule: {
    args: [FFIType.cstring, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyObject_IsInstance: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: INT,
  },

  PyDict_GetItemString: {
    args: [FFIType.pointer, FFIType.cstring],
    returns: FFIType.pointer,
  },

  PyTuple_Size: {
    args: [FFIType.pointer],
    returns: SSIZE_T,
  },

  PyTuple_GetItem: {
    args: [FFIType.pointer, SSIZE_T],
    returns: FFIType.pointer,
  },

  PyCFunction_New: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },
} as const;
