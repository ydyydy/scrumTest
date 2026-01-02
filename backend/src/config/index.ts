import * as dotenv from 'dotenv';

dotenv.config();

export const envs = {
  postgresHost: process.env.DB_HOST || 'localhost',
  postgresPort: parseInt(process.env.DB_PORT || '5432', 10),
  postgresUser: process.env.DB_USER || 'postgres',
  postgresPassword: process.env.DB_PASSWORD || 'admin',
  postgresDb: process.env.DB_NAME || 'postgres',
};
