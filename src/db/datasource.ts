import { DataSource, DataSourceOptions } from "typeorm";
import {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE
} from "../config/env-variables";
import { Artefactos } from "../entity/Artefactos";
import { Exploradores } from "../entity/Exploradores";
import { GruposExploradores } from "../entity/GruposExploradores";
import { Entradas } from "../entity/Entradas";
import { Fauna } from "../entity/Fauna";
import { Flora } from "../entity/Flora";
import { Capas } from "../entity/Capas";
import { Rangos } from "../entity/Rangos";
import { Solicitudes } from "../entity/Solicitudes";
import { Usuarios } from "../entity/Usuarios";

const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    synchronize: true,
    logging: false,
    entities: [Artefactos, Exploradores, GruposExploradores, Entradas, Fauna, Flora, Capas, Rangos, Solicitudes, Usuarios],
    migrations: [],
    subscribers: [],
}

export default new DataSource(dataSourceOptions);