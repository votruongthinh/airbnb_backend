import 'dotenv/config';

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
console.log(
  '\n',
  {
    PORT,
    DATABASE_URL: DATABASE_URL ? 'SET' : 'MISSING',
    ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET ? 'SET' : 'MISSING',
    REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET ? 'SET' : 'MISSING',
    CLOUDINARY_URL: CLOUDINARY_URL ? 'SET' : 'MISSING',
  },
  '\n',
);
