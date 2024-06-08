import * as dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST || "0.0.0.0";
export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST ?? "localhost";
export const DB_PORT = Number(process.env.DB_PORT) ?? 5432;
export const DB_USERNAME = process.env.DB_USERNAME ?? "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "12345";
export const DB_DATABASE = process.env.DB_DATABASE ?? "GiA";
export const TOKEN_SECRET = process.env.TOKEN_SECRET ?? "secreto";
export const JWT_EXPIRES = process.env.JWT_EXPIRES ?? "60s";
