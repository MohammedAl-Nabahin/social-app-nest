import * as dotenv from 'dotenv';
dotenv.config();

export const production = () => ({
  database: {
    dialect: process.env.DB_DIALECT || 'mysql',
    port: Number(process.env.PORT),
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});
