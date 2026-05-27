import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      ".worktrees/**",
      ".next/**",
      "out/**",
      "public/r/**",
      "public/animations.jsx",
      "public/components.jsx",
      "public/scenes.jsx",
      "android/**/build/**",
    ],
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
