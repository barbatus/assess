const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/$1",
    "\\.css$": "identity-obj-proxy"
  },
  transform: {
    "\\.jsx?": "babel-jest",
    "\\.(gql|graphql)$": "jest-transform-graphql"
  },
};
module.exports = createJestConfig(customJestConfig);
