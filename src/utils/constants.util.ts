import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import './../config/setup.config';

const env = {
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'secret',
  NEXTAUTH_EXPIRES_IN: Number(process.env.NEXTAUTH_EXPIRES_IN) || 86400,
  CRYPTR_SECRET: process.env.CRYPTR_SECRET || 'secret',
};

const regex = {
  EMAIL:
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  USERNAME: /^(?=.{3,24}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
};

const time = {
  CURRENT_MONTH: Number(new Date().getMonth().toString()) + 1,
  CURRENT_YEAR: Number(new Date().getFullYear().toString().slice(2)),
  CURRRENT_DATE: Number(
    new Date().toISOString().slice(0, 19).replace('T', ' '),
  ),
};

const database = {
  INT4_MAX: 2147483647,
};

const PrismaErrors =
  PrismaClientValidationError ||
  PrismaClientInitializationError ||
  PrismaClientKnownRequestError ||
  PrismaClientRustPanicError ||
  PrismaClientUnknownRequestError;

export { env, regex, time, database, PrismaErrors };
