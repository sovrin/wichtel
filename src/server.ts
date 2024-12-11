import express from 'express'
import {route} from './router'
import path from 'node:path'
import {engine} from 'express-handlebars';
import {PORT} from "./const";

const app = express();

app.set('view engine', 'hbs');
app.engine('hbs', engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    defaultLayout: 'index',
    extname: 'hbs',
    helpers: {
        json: (context: object) => JSON.stringify(context),
        random: (context: string, from: number, to: number) => {
            const value = Math.floor(Math.random() * (to - from) + from);

            return context.replace(/%d/, value.toString());
        },
    }
}));
app.set('views', path.join(__dirname, 'views'))

route(app);

const server = app.listen(parseInt(String(PORT)), '0.0.0.0', () => {
    console.log(`Server listening on port ${server.address()['port']}`);
});
