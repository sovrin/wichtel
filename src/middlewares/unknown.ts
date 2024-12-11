import {Request, Response, NextFunction, RequestHandler} from "express";

const closure = (): RequestHandler => {
    return (_req: Request, res: Response, next: NextFunction) => {
        res.render('404');
    };
}
export default closure;
