import "@/utils/env.utils.js";

export const appConfig = {
  port: Number(process.env.APP_PORT),
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  },
  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) ?? 10,
  },
  databaseUrl: process.env.DATABASE_URL!,
};
