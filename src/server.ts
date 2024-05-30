import app from "./app";
import datasource from "./db/datasource";
import artifactRouter from "./routes/artifactRouter";
import delverGroupRouter from "./routes/delverGroupRouter";
import delverRouter from "./routes/delverRouter";
import entryRouter from "./routes/entryRouter";
import faunaRouter from "./routes/faunaRouter";
import floraRouter from "./routes/floraRouter";
import layerRouter from "./routes/layerRouter";
import rankRouter from "./routes/rankRouter";
import requestRouter from "./routes/requestRouter";
import userRouter from "./routes/userRouter";
import { PORT } from "./config/env-variables";

try {
    datasource.initialize().then(() => {
        console.log("Database connected successfully");

        app.use("/artifact", artifactRouter);
        app.use("/delverGroup", delverGroupRouter);
        app.use("/delver", delverRouter);
        app.use("/entry", entryRouter);
        app.use("/fauna", faunaRouter);
        app.use("/flora", floraRouter);
        app.use("/layer", layerRouter);
        app.use("/rank", rankRouter);
        app.use("/request", requestRouter);
        app.use("/user", userRouter);

        app.listen(PORT, () => {
            console.log(`Server listening to port ${PORT}`);
        });
    });
} catch (error) {
    console.log(error);
    process.exit(1);
}