"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const datasource_1 = __importDefault(require("./db/datasource"));
const env_variables_1 = require("./config/env-variables");
try {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield datasource_1.default.initialize();
        if (datasource_1.default.isInitialized) {
            console.log("Database connected successfully");
            app_1.default.listen(env_variables_1.DB_PORT, () => {
                console.log(`Server listening to port ${process.env.PORT}`);
            });
        }
    }));
}
catch (error) {
    console.log(error);
    process.exit(1);
}
