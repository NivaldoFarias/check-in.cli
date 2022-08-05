import type { NextApiRequest, NextApiResponse } from 'next';

import { RegisterRequest } from '../../types/patient';
import exceptionHandler from '../../utils/exception.util';

import AppError from '../../config/error.config';
import client from '../../config/database.config';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    throw new AppError(
      405,
      'Method not allowed',
      'Endpoint only accepts POST requests',
    );
  }

  const body: RegisterRequest = req.body;
  const { common, registry, address } = body;

  if (!common || !registry || !address) {
    throw new AppError(
      400,
      'Bad Request',
      'Ensure to provide all required fields',
    );
  }

  common.code = createCode();
  await client.patient.create({
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
