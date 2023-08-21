import { python } from "..";

const { print } = python.builtins;
const tf = python.import("tensorflow");

print("TensorFlow version:", tf.__version__);