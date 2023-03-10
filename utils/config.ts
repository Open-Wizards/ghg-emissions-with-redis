import dotEnv from 'dotenv';
import logger from './pino';

dotEnv.config();

interface IConfig {
  PORT: number | string;
  DB_URL: string;
  JWT_SECRET: string;
  [key: string]: string | number;
}

const config: IConfig = {
  PORT: process.env.PORT! || 8888,
  DB_URL: process.env.DB_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
};

export function checkEnvironmentVariables() {
  Object.keys(config).forEach((key: string) => {
    if (!config[key]) {
      logger.error(`Environment variable ${key} is not defined.`);
    }
  });
}

export default config;
