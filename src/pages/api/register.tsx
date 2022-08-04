import type { NextApiRequest, NextApiResponse } from 'next';

import { RegisterRequest } from '../../types/patient';
import exceptionHandler from '../../utils/exception.util';

import AppError from '../../config/error.config';
import client from '../../config/database.config';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body: RegisterRequest = req.body;
  const { common, registry, address } = body;
  if (!common || !registry || !address) {
    throw new AppError(
      400,
      'Bad Request',
      'Ensure to provide all required fields',
    );
  }

  await client.patient.create({
    data: { ...common, Registry: { ...registry }, Address: { ...address } },
  });

  return res.status(201).send('Created');
}

export default exceptionHandler(handler);
