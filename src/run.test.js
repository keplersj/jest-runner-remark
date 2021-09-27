import run from "./run";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Remove undeterministic data from test reports
expect.addSnapshotSerializer({
  print: (value, serialize) => {
    delete value.perfStats;
    delete value.testFilePath;
    value.testResults.forEach((result) => {
      delete result.duration;
    });
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
        config: {},
        globalConfig: {},
      });
      return expect(result).toMatchSnapshot();
    });
  });
});
