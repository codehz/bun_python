import { sleep } from "bun";

new Worker(new URL("./run_code.ts", import.meta.url));
await sleep(100);
