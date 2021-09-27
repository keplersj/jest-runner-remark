import { createJestRunner } from "create-jest-runner";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pathName = require.resolve("./run");

export default createJestRunner(pathName);
