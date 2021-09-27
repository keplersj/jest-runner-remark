export default {
  projects: [
    {
      displayName: "test",
      transform: {},
    },
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
