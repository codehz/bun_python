import { CString } from "bun:ffi";

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

const EMPTY = new Uint8Array([0]);

export function cstr(jsstr: string) {
  return (jsstr ? encoder.encode(jsstr) : EMPTY) as unknown as CString;
}

/**
 * Regular Expression used to test if a string is a `proper_slice`.
 *
 * Based on https://docs.python.org/3/reference/expressions.html#slicings
 */
export const SliceItemRegExp =
  /^\s*(-?\d+)?\s*:\s*(-?\d+)?\s*(:\s*(-?\d+)?\s*)?$/;
