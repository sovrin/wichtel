import {Request, Response, NextFunction, ErrorRequestHandler} from "express";

const closure = (): ErrorRequestHandler => {
    return (err: any, _req: Request, res: Response, next: NextFunction) => {
        if (err) {
            res.status(err.statusCode || 500)
                .json({message: err.message});
        }

        next();
    };
}
export default closure;
