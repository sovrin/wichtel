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
        json: (context: never) => JSON.stringify(context),
    }
}));
app.set('views', path.join(__dirname, 'views'))

route(app);

const server = app.listen(parseInt(String(PORT)), '0.0.0.0', () => {
    console.log(`Server listening on port ${server.address()['port']}`);
});
