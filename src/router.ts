import express, {Express} from "express";

import santaRouter from "./routes/santa";
import adminRouter from "./routes/admin";
import errorMiddleware from "./middlewares/error";


export const route = (app: Express) => {
    app.locals = {
        site: {
            year: new Date().getFullYear()
        },
    }

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(errorMiddleware());

    app.use('/admin', adminRouter);
    app.use('/', santaRouter);
}
