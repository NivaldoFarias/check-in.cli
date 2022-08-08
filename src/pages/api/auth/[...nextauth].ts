import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';

import client from '../../../config/database.config';
import AppError from '../../../config/error.config';
import { env } from '../../../utils/constants.util';
import { NextApiRequest, NextApiResponse } from 'next';
import exceptionHandler from '../../../utils/exception.util';

async function auth(req: NextApiRequest, res: NextApiResponse) {
  const options: NextAuthOptions = {
    adapter: PrismaAdapter(client),
    secret: env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
      maxAge: env.NEXTAUTH_EXPIRES_IN,
    },
    pages: {
      signIn: '/auth/login',
      signOut: '/auth/logout',
      error: '/auth/login',
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
          const { cpf, password } = credentials ?? {};

          const patient = await client.patient.findUnique({
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
