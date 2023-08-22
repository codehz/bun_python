import {
  CString,
  FFIType,
  FFITypeOrString,
  Pointer,
  ToFFIType,
  dlopen,
} from "bun:ffi";

interface FFIFunction {
  readonly args?: readonly FFITypeOrString[];
  readonly returns?: FFITypeOrString;
  readonly ptr?: number | bigint;
  readonly threadsafe?: boolean;
}

interface FFITypeToArgType {
  [FFIType.char]: number;
  [FFIType.int8_t]: number;
  [FFIType.i8]: number;
  [FFIType.uint8_t]: number;
  [FFIType.u8]: number;
  [FFIType.int16_t]: number;
  [FFIType.i16]: number;
  [FFIType.uint16_t]: number;
  [FFIType.u16]: number;
  [FFIType.int32_t]: number;
  [FFIType.i32]: number;
  [FFIType.int]: number;
  [FFIType.uint32_t]: number;
  [FFIType.u32]: number;
  [FFIType.int64_t]: number | bigint;
  [FFIType.i64]: number | bigint;
  [FFIType.uint64_t]: number | bigint;
  [FFIType.u64]: number | bigint;
  [FFIType.double]: number;
  [FFIType.f64]: number;
  [FFIType.float]: number;
  [FFIType.f32]: number;
  [FFIType.bool]: boolean;
  [FFIType.ptr]: TypedArray | Pointer | CString;
  [FFIType.pointer]: TypedArray | Pointer | CString;
  [FFIType.void]: void;
  [FFIType.cstring]: TypedArray | Pointer | CString;
  [FFIType.i64_fast]: number | bigint;
  [FFIType.u64_fast]: number | bigint;
  [FFIType.function]: (...args: any[]) => any;
}

interface FFITypeToReturnsType {
  [FFIType.char]: number;
  [FFIType.int8_t]: number;
  [FFIType.i8]: number;
  [FFIType.uint8_t]: number;
  [FFIType.u8]: number;
  [FFIType.int16_t]: number;
  [FFIType.i16]: number;
  [FFIType.uint16_t]: number;
  [FFIType.u16]: number;
  [FFIType.int32_t]: number;
  [FFIType.i32]: number;
  [FFIType.int]: number;
  [FFIType.uint32_t]: number;
  [FFIType.u32]: number;
  [FFIType.int64_t]: bigint;
  [FFIType.i64]: bigint;
  [FFIType.uint64_t]: bigint;
  [FFIType.u64]: bigint;
  [FFIType.double]: number;
  [FFIType.f64]: number;
  [FFIType.float]: number;
  [FFIType.f32]: number;
  [FFIType.bool]: boolean;
  [FFIType.ptr]: Pointer;
  [FFIType.pointer]: Pointer;
  [FFIType.void]: void;
  [FFIType.cstring]: CString & string;
  [FFIType.i64_fast]: number | bigint;
  [FFIType.u64_fast]: number | bigint;
  [FFIType.function]: (...args: any[]) => any;
}

export type LibraryDefinition = Readonly<Record<string, FFIFunction>>;

type ConvertFns<Fns extends LibraryDefinition> = {
  readonly [K in keyof Fns]: (
    ...args: Fns[K]["args"] extends infer A extends readonly FFITypeOrString[]
      ? { [L in keyof A]: FFITypeToArgType[ToFFIType<A[L]>] }
      : never
  ) => FFITypeToReturnsType[ToFFIType<NonNullable<Fns[K]["returns"]>>];
};

export interface LibraryFix<Fns extends LibraryDefinition> {
  symbols: ConvertFns<Fns>;

  /**
   * `dlclose` the library, unloading the symbols and freeing allocated memory.
   *
   * Once called, the library is no longer usable.
   *
   * Calling a function from a library that has been closed is undefined behavior.
   */
  close(): void;
}

export const dlopen_fix = dlopen as any as <Fns extends LibraryDefinition>(
  name: string,
  symbols: Fns
) => LibraryFix<Fns>;
