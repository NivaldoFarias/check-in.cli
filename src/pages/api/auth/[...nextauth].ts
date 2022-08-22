import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';

import prisma from '../../../config/database.config';
import { env } from '../../../utils/constants.util';
import { NextApiRequest, NextApiResponse } from 'next';
import exceptionHandler from '../../../utils/exception.util';
import logger from '../../../config/logger.config';

async function auth(req: NextApiRequest, res: NextApiResponse) {
  const options: NextAuthOptions = {
    secret: env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
      maxAge: env.NEXTAUTH_EXPIRES_IN,
    },
    pages: {
      signIn: '/auth/check-in',
      signOut: '/auth/check-out',
      error: '/auth/check-in',
    },
    callbacks: {},
    providers: [
      CredentialsProvider({
        id: 'credentials',
        name: 'Login',
        credentials: {
          cpf: {
            label: 'CPF',
            type: 'text',
            placeholder: 'CPF',
          },
          password: {
            label: 'Password',
            type: 'password',
            placeholder: 'Password',
          },
        },
        authorize: async (credentials: any, _req) => {
          const { cpf, password } = credentials ?? {};
          let patient = null;

          logger.info('Authorizing credentials');

          try {
            patient = await prisma.patient.findUnique({
              where: { cpf },
            });
            if (!patient) throw Error('NOT_FOUND');
          } catch (error: any) {
            error.stack = 'stack has been hidden';
            logger.error(error);
            throw new Error(error.message);
          }

          const isValid = bcrypt.compareSync(
            password as string,
            patient.password,
          );
          if (!isValid) return null;

          return patient;
        },
      }),
    ],
  };

  return await NextAuth(req, res, options);
}

export default exceptionHandler(auth);
