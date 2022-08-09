import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';

import prisma from '../../../config/database.config';
import AppError from '../../../config/error.config';
import { env } from '../../../utils/constants.util';
import { NextApiRequest, NextApiResponse } from 'next';
import exceptionHandler from '../../../utils/exception.util';
import logger from '../../../config/logger.config';

async function auth(req: NextApiRequest, res: NextApiResponse) {
  const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
      maxAge: env.NEXTAUTH_EXPIRES_IN,
    },
    pages: {
      signIn: '/auth/check-in',
      signOut: '/auth/logout',
      error: '/auth/check-in',
      verifyRequest: '/auth/verify-request',
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
        authorize: async (credentials) => {
          logger.info('credentials');
          if (req.method !== 'POST') {
            throw new AppError(
              405,
              'Method not allowed',
              'Endpoint only accepts POST requests',
            );
          }

          const { cpf, password } = credentials ?? {};

          const patient = await prisma.patient.findUnique({
            where: { cpf },
          });
          if (!patient) {
            throw new AppError(
              404,
              'Patient not found',
              'Ensure to provide valid credentials',
            );
          }

          const isValid = bcrypt.compareSync(
            password as string,
            patient.password,
          );
          if (!isValid) {
            throw new AppError(
              401,
              'Unauthorized',
              'Ensure to provide valid credentials',
            );
          }

          return patient;
        },
      }),
    ],
  };

  return await NextAuth(req, res, options);
}

export default exceptionHandler(auth);
