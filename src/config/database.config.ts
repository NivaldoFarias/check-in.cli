import { PrismaClient } from '@prisma/client';

import logger from './logger.config';
import './setup.config';

const client = new PrismaClient();
connectToDatabase();

export default client;

async function connectToDatabase() {
  try {
    await client.$connect();
    logger.trace({ database: 'Connected to database' });
  } catch (error) {
    logger.error(error);
  }
}
