const defaultStandardVersion = require('@davidsneighbour/release-config');
const localStandardVersion = {
  scripts: {},
  bumpFiles: [
    {
      filename: "package.json",
      type: "json",
    },
    {
      filename: "exampleSite/data/ananke/build.json",
      type: "json",
    },
  ],
  header: "# Changelog",
  types: [
    { type: "content", section: "Content" },
    { type: "docs", section: "Documentation" },
    { type: "feat", section: "Features" },
    { type: "theme", section: "Theme" },
    { type: "style", section: "Styling" },
    { type: "refactor", section: "Refactors" },
    { type: "test", section: "Tests" },
    { type: "chore", section: "Chore" },
    { type: "config", section: "Configuration" },
    { type: "build", section: "Build System" },
    { type: "ci", section: "CI" },
  ]
};
const standardVersion = {
  ...defaultStandardVersion,
  ...localStandardVersion,
};
module.exports = standardVersion;
