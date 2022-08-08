import type { NextApiRequest, NextApiResponse } from 'next';
import type { Algorithm, SignOptions } from 'jsonwebtoken';
import type { LoginRequest } from '../../../types/patient';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import exceptionHandler from '../../../utils/exception.util';
import { env } from '../../../utils/constants.util';

import AppError from '../../../config/error.config';
import client from '../../../config/database.config';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    throw new AppError(
      405,
      'Method not allowed',
      'Endpoint only accepts POST requests',
    );
  }

  const { cpf, password }: LoginRequest = req.body;
  const patient = await client.patient.findUnique({
    where: {
      cpf,
    },
  });

  if (!patient) {
    throw new AppError(
      404,
      'Patient not found',
      'Ensure to provide valid credentials',
    );
  }

  const isValid = bcrypt.compareSync(password as string, patient.password);
  if (!isValid) {
    throw new AppError(
      401,
      'Unauthorized',
      'Ensure to provide valid credentials',
    );
  }

  const token = _generateToken({ ...patient });
  res.status(200).json({ token });
}

function _generateToken({ ...payload }) {
  const subject = 'user';
  const secretKey = env.JWT_SECRET;
  const expiresIn = env.JWT_EXPIRES_IN;
  const algorithm = env.JWT_ALGORITHM as Algorithm;

  const config: SignOptions = { algorithm, expiresIn, subject };
  const token = jwt.sign(payload, secretKey, config);

  return token;
}

export default exceptionHandler(handler);
