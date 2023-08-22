import { CString, FFIType } from "bun:ffi";
import { type } from "node:os";
import { LibraryDefinition, LibraryFix, dlopen_fix } from "./types";

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

const libDlDef = {
  dlopen: {
    args: [FFIType.cstring, FFIType.i32],
    returns: FFIType.pointer,
  },
} as const;

/**
 * On Unix based systems, we need to supply dlopen with RTLD_GLOBAL
 * but Deno.dlopen does not support passing that flag. So we'll open
 * libc and use its dlopen to open with RTLD_LAZY | RTLD_GLOBAL to
 * allow subsequently loaded shared libraries to be able to use symbols
 * from Python C API.
 */
export function postSetup(lib: string) {
  let libdl: LibraryFix<typeof libDlDef>;
  if (type() === "Linux") {
    const libc = dlopen_fix(`libc.so.6`, {
      gnu_get_libc_version: { args: [], returns: FFIType.cstring },
    } as const);
    const glibcVersion = +libc.symbols.gnu_get_libc_version();
    libdl = dlopen_fix(
      glibcVersion >= 2.34 ? `libc.so.6` : `libdl.so.2`,
      libDlDef
    );
  } else if (type() === 'Darwin') {
    libdl = dlopen_fix(`libdl.dylib`, libDlDef);
  } else {
    return;
  }
  libdl.symbols.dlopen(cstr(lib), 0x0_01_01);
}

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
