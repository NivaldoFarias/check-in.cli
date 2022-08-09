import type { NextApiRequest, NextApiResponse } from 'next';
import type { RegisterRequest } from '../../types/patient';
import bcrypt from 'bcrypt';

import exceptionHandler from '../../utils/exception.util';
import { env } from '../../utils/constants.util';

import AppError from '../../config/error.config';
import prisma from '../../config/database.config';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    throw new AppError(
      405,
      'Method not allowed',
      'Endpoint only accepts POST requests',
    );
  }

  const { common, registry, address }: RegisterRequest = req.body;
  if (!common || !registry || !address || !common.password) {
    throw new AppError(
      400,
      'Bad Request',
      'Ensure to provide all required fields',
    );
  }

  const encrypted = bcrypt.hashSync(common.password, env.BCRYPT_SALT_ROUNDS);
  const code = createCode();

  registry.code = code;
  common.password = encrypted;
  await prisma.patient.create({
    data: {
      ...common,
      Registry: { create: registry },
      Address: { create: address },
    },
  });

  return res.status(201).send('Created');
}

function createCode() {
  const code = Math.floor(Math.random() * 99999999) + 1;
  const str = code.toString().padStart(8, '0');

  return str;
}

export default exceptionHandler(handler);
