import { TestResult } from "@jest/test-result";
import { engine } from "unified-engine";
import { remark } from "remark";
import { Writable } from "stream";
import { pass, fail } from "create-jest-runner";

class NoOpStream extends Writable {
  _write(_: any, __: any, next: Function): void {
    next();
  }
}

interface Parameters {
  testPath: string;
}

export default ({ testPath }: Parameters): Promise<TestResult> => {
  const output: string[] = [];

  class StoreStream extends Writable {
    _write(chunk: any, _: any, next: Function): void {
      output.push(chunk.toString());
      next();
    }
  }

  const start = Date.now();
  return new Promise((resolve, reject) => {
    engine(
      {
        processor: remark,
        files: [testPath],
        extensions: ["md", "mdx", "markdown", "mkd", "mkdn", "mkdown"],
        pluginPrefix: "remark",
        rcName: ".remarkrc",
        packageField: "remarkConfig",
        ignoreName: ".remarkignore",
        color: true,
        streamOut: new NoOpStream(),
        streamError: new StoreStream(),
      },
      (error, code, context) => {
        if (error) {
          return reject(error);
        }

        if (code === 0) {
          const result = pass({
            start,
            end: Date.now(),
            test: {
              path: testPath,
              title: "Remark",
              errorMessage: output.toString(),
            },
          });

          if (
            context &&
            context.files &&
            context.files[0].messages.length != 0
          ) {
            result.console = [
              { message: output.join(), origin: "", type: "warn" },
            ];
          }

          return resolve(result);
        } else if (code === 1) {
          return resolve(
            fail({
              start,
              end: Date.now(),
              test: {
                path: testPath,
                title: "Remark",
                errorMessage: output.join(),
              },
            })
          );
        } else {
          return reject();
        }
      }
    );
  });
};
