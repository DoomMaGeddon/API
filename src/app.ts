import express from "express";
import bodyParser from "body-parser";
import { requestLogger } from "./utils/logger";

const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(requestLogger);

export default expressApp;