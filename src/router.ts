import express, {Express} from "express";
import santaRouter from "./routes/santa";

export const route = (app: Express) => {
    app.locals = {
        site: {
            year: new Date().getFullYear()
        },
    }

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use('/', santaRouter);
}
