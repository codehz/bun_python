import { sleep } from "bun";

new Worker(new URL("./run_code.ts", import.meta.url).href);
await sleep(100);
