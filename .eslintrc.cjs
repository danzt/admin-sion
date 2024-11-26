module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": "warn",
    eqeqeq: "error",
    "react/destructuring-assignement": "error",
    "react/no-array-index-key": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
