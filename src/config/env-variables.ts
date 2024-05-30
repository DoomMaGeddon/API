import * as dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST || "localhost";
export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST ?? "localhost";
export const DB_PORT = Number(process.env.DB_PORT) ?? 5432;
export const DB_USERNAME = process.env.DB_USERNAME ?? "";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
export const DB_DATABASE = process.env.DB_DATABASE ?? "";
export const TOKEN_SECRET = process.env.TOKEN_SECRET ?? "";
export const JWT_EXPIRES = process.env.JWT_EXPIRES ?? "60s";