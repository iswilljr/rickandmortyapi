/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", "plugin:prettier/recommended"],
  parserOptions: {
    project: ["tsconfig.json", "site/tsconfig.json"],
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: "site/**/*",
      settings: { react: { version: "18" } },
      extends: [
        "@remix-run/eslint-config/node",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
      ],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/promise-function-async": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};
