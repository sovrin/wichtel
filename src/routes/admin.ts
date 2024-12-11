import {Router} from "express";
import {generateLinks} from "../services/santa";
import basicAuth from "express-basic-auth";
import {BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD} from "../const";
import {getGoupByName} from "../models/groups";

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
    const {params} = req;
    const {group: groupName, year} = params;

    try {
        const fullUrl = req.protocol + '://' + req.get('host');

        const group = await getGoupByName(groupName);
        if (!group) {
            return res.status(404)
                .render('404');
        }

        const links = (await generateLinks(group, parseInt(year)))
            .map(({name, link}) => ({
                name,
                link: `${fullUrl}/${link}`
            }));

        if (!links) {
            return res.status(404)
                .render('404');
        }

        res.render('pages/admin/links', {
            links,
            group,
        });
    } catch (error) {
        console.error(error.message);

        return res.status(500)
            .render('500')
    }
});

export default admin;
