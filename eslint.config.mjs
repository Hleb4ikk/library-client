import serverConfig from "./server/eslint.config.mjs";

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
  //TODO: раскомментить когда появится конфиг для клиента
  //   ...clientConfig.map((config) => ({
  //     ...config,
  //     files: ["client/src/**/*.{ts,tsx,js,jsx}"],
  //   })),

  ...serverConfig.map((config) => ({
    ...config,
    files: ["server/src/**/*.{ts,js}"],
  })),
];
