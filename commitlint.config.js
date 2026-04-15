import { RuleConfigSeverity } from "@commitlint/types";

const Configuration = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: "conventional-changelog-atom",
  formatter: "@commitlint/format",
  rules: {
    "type-enum": [RuleConfigSeverity.Error, "always", ["foo"]],
  },
  // ...
};

export default Configuration;
