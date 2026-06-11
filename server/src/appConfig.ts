import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

if (!jwtSecret) {
  throw new Error('ACCESS_TOKEN_SECRET environment variable is not defined');
}

export const appConfig = {
  port: Number(process.env.APP_PORT),
  jwt: {
    secret: jwtSecret,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
  },
};
