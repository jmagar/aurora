// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  ignores: [
    ".worktrees/**",
    ".next/**",
    "out/**",
    "storybook-static/**",
    "public/r/**",
    "public/dinglebear/**",
    "android/**/build/**",
    "themes/**",
    "dinglebear/**",
  ],
}, {
  rules: {
    "@next/next/no-img-element": "off",
  },
}, ...storybook.configs["flat/recommended"]];

export default eslintConfig;
