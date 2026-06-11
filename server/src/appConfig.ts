import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

if (!jwtSecret) {
  throw new Error('ACCESS_TOKEN_SECRET environment variable is not defined');
}

const DEFAULT_BCRYPT_SALT_ROUNDS = 10;

function parseBcryptSaltRounds(): number {
  const value = process.env.BCRYPT_SALT_ROUNDS;

  if (!value) {
    return DEFAULT_BCRYPT_SALT_ROUNDS;
  }

  const saltRounds = Number(value);

  if (!Number.isInteger(saltRounds) || saltRounds < 4 || saltRounds > 31) {
    throw new Error('BCRYPT_SALT_ROUNDS must be an integer between 4 and 31');
  }

  return saltRounds;
}

export const appConfig = {
  port: Number(process.env.APP_PORT),
  jwt: {
    secret: jwtSecret,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
  },
  bcrypt: {
    saltRounds: parseBcryptSaltRounds(),
  },
};
