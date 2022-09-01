const nxPreset = require("@nrwl/jest/preset").default;

module.exports = {
  ...nxPreset,
  collectCoverage: true,
  coverageReporters: ["clover", "json", "lcov", "text"],
};
