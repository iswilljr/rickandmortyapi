/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", "plugin:prettier/recommended"],
  parserOptions: {
    project: ["tsconfig.json"],
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/promise-function-async": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/return-await": "off",
  },
};
