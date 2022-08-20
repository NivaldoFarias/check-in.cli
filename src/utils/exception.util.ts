import { NextApiRequest, NextApiResponse } from 'next';

import AppError from '../config/error.config';
import logger from '../config/logger.config';

function exceptionHandler(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    return handler(req, res).catch((error: AppError) => {
      const { statusCode, message, details } = error;
      logger.error({
        message,
        details: error ? error.details ?? [] : details ?? '',
      });
      return error instanceof AppError
        ? res.status(statusCode).send({ message, details })
        : res.status(500).send({
            message: `Internal server error`,
            details: 'Error occurred while processing request',
          });
    });
  };
}

export default exceptionHandler;
