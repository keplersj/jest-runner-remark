const engine = require("unified-engine");
const remark = require("remark");
const stream = require("stream");
const { pass, fail } = require("create-jest-runner");

class NoOpStream extends stream.Writable {
  _write(chunk, enc, next) {
    next();
  }
}

module.exports = ({ testPath }) => {
  const output = [];

  class StoreStream extends stream.Writable {
    _write(chunk, enc, next) {
      output.push(chunk.toString());
      next();
    }
  }

  const start = new Date();
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
        streamError: new StoreStream()
      },
      (error, code, context) => {
        if (error) {
          return reject(error);
        }

        if (code === 0) {
          const result = pass({
            start,
            end: new Date(),
            test: {
              path: testPath,
              title: "Remark",
              errorMessage: output.toString()
            }
          });

          if (context.files[0].messages.length != 0) {
            result.console = [
              { message: output.join(), origin: "", type: "warn" }
            ];
          }

          return resolve(result);
        } else if (code === 1) {
          return resolve(
            fail({
              start,
              end: new Date(),
              test: {
                path: testPath,
                title: "Remark",
                errorMessage: output.join()
              }
            })
          );
        } else {
          return reject();
        }
      }
    );
  });
};
