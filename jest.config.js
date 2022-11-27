module.exports = {
   transform: {
      "^.+\\.(t|j)sx?$": ["@swc/jest"],
   },
   silent: true,
   testMatch: ["**/src/**/*.test.ts"],
};
