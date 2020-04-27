module.exports = {
  projects: [
    {
      preset: "jest-runner-prettier",
      displayName: "lint:prettier",
    },
    {
      runner: "eslint",
      displayName: "lint:eslint",
      testMatch: ["<rootDir>/**/*.js"],
    },
  ],
};
