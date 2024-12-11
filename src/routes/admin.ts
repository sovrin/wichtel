import {Router} from "express";
import {generateLinks} from "../services/santa";
import basicAuth from "express-basic-auth";
import {BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD} from "../const";

const admin = Router();

admin.use(
    basicAuth({
        challenge: true,
        users: {
            [BASIC_AUTH_USERNAME]: BASIC_AUTH_PASSWORD
        },
    })
)

admin.get('/links/:year/:group', async (req, res) => {
    try {
        const fullUrl = req.protocol + '://' + req.get('host');

        const {group, year} = req.params;
        if(!group) {
            return res.render('404');
        }

        const links = (await generateLinks(group, parseInt(year)))
            .map(({name, link}) => ({
                name,
                link: `${fullUrl}/${link}`
            }));

        if (!links) {
            return res.render('404');
        }

        res.render('pages/admin/links', {
            links,
            group,
        });
    }  catch (error) {
        console.error(error.message);

        return res.status(500)
            .render('500')
    }
});

export default admin;
