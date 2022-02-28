import run from "./run";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Remove undeterministic data from test reports
expect.addSnapshotSerializer({
  print: (value: any, serialize) => {
    delete value.perfStats;
    delete value.testFilePath;
    for (const result of value.testResults) {
      delete result.duration;
    }
    return serialize(value);
  },
  test: (value) =>
    value && value.perfStats && value.testFilePath && value.testResults,
});

describe("Remark-Lint Jest Runner", () => {
  describe("good fixture", () => {
    it("matches snapshot", async () => {
      const result = await run({
        testPath: join(__dirname, "__fixtures__", `good.md`),
      });
      return expect(result).toMatchSnapshot();
    });
  });
});
