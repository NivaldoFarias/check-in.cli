import { NextApiRequest, NextApiResponse } from 'next';
import AppError from '../config/error.config';

function exceptionHandler(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    return handler(req, res).catch((error: AppError) => {
      const { log, statusCode, message, details } = error;

      console.log(log);
      console.error(error);
      return error instanceof AppError
        ? res.status(statusCode).send({ message, details })
        : res.status(500).send({
            message: `Internal server error`,
            details: error,
          });
    });
  };
}

export default exceptionHandler;
