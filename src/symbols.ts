import { FFIType } from 'bun:ffi';
import { type,  } from 'node:os';

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
export type SYMBOLS = DeepWriteable<typeof SYMBOLS>;

const INT = FFIType.i32;
const LONG = type() === 'Windows' ? FFIType.i32 as const: FFIType.i64 as const;
const SSIZE_T = FFIType.i64

export const SYMBOLS = {
  Py_DecodeLocale: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  Py_SetProgramName: {
    args: [FFIType.pointer],
    returns: FFIType.void,
  },

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

  PyObject_DelItem: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: INT,
  },

  PyObject_Call: {
    callback: true,
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyObject_CallObject: {
    args: [FFIType.pointer, FFIType.pointer],
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

  PyLong_FromLong: {
    args: [LONG],
    returns: FFIType.pointer,
  },

  PyLong_AsUnsignedLongMask: {
    args: [FFIType.pointer],
    returns: LONG,
  },

  PyLong_FromUnsignedLong: {
    args: [LONG],
    returns: FFIType.pointer,
  },

  PyUnicode_AsUTF8: {
    args: [FFIType.pointer],
    returns: FFIType.cstring,
  },

  PyUnicode_DecodeUTF8: {
    args: [FFIType.pointer, SSIZE_T, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyBytes_FromStringAndSize: {
    args: [FFIType.pointer, SSIZE_T],
    returns: FFIType.pointer,
  },

  PyBytes_AsStringAndSize: {
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: INT,
  },

  PyBool_Type: {
    args: [],
    returns: FFIType.pointer,
  },

  PySlice_Type: {
    args: [],
    returns: FFIType.pointer,
  },

  PyNumber_Add: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_Subtract: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_Multiply: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_TrueDivide: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_InPlaceAdd: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_InPlaceSubtract: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_InPlaceMultiply: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_InPlaceTrueDivide: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_Negative: {
    args: [FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_And: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_Or: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_Xor: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_InPlaceAnd: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_InPlaceOr: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_InPlaceXor: {
    args: [FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },

  PyNumber_Invert: {
    args: [FFIType.pointer],
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

  PyTuple_Pack: {
    type: FFIType.pointer,
  },

  PyCFunction_NewEx: {
    args: [FFIType.pointer, FFIType.pointer, FFIType.pointer],
    returns: FFIType.pointer,
  },
} as const;