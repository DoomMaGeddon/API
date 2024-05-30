"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const env_variables_1 = require("../config/env-variables");
const dataSourceOptions = {
    type: "postgres",
    host: env_variables_1.DB_HOST,
    port: env_variables_1.DB_PORT,
    username: env_variables_1.DB_USERNAME,
    password: env_variables_1.DB_PASSWORD,
    database: env_variables_1.DB_DATABASE
};
exports.default = new typeorm_1.DataSource(dataSourceOptions);
