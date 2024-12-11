import express, {Express} from "express";

import santaRouter from "./routes/santa";
import adminRouter from "./routes/admin";
import errorMiddleware from "./middlewares/error";
import unknownMiddleware from "./middlewares/unknown";


export const route = (app: Express) => {
    app.locals = {
        site: {
            year: new Date().getFullYear()
        },
    }

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public'))
    app.use(errorMiddleware());

    app.use('/admin', adminRouter);
    app.use('/', santaRouter);

    app.use(unknownMiddleware());
}
