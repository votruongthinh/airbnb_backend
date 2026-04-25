import 'dotenv/config';

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
console.log(
  '\n',
  {
    PORT: PORT,
    DATABASE_URL: DATABASE_URL,
    ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
  },
  '\n',
);
