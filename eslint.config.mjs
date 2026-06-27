import serverConfig from "./server/eslint.config.mjs";
import clientConfig from "./client/eslint.config.mjs";
import emailWorkerConfig from "./email-worker/eslint.config.mjs";

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
  ...clientConfig.map((config) => ({
    ...config,
    files: ["client/src/**/*.{ts,tsx,js,jsx}"],
  })),

  ...serverConfig.map((config) => ({
    ...config,
    files: ["server/src/**/*.{ts,js}"],
  })),

  ...emailWorkerConfig.map((config) => ({
    ...config,
    files: ["email-worker/src/**/*.{ts,js}"],
  })),
];
