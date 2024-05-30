import express from "express";
import bodyParser from "body-parser";

const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

export default expressApp;