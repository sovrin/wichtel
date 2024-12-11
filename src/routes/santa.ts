import {Router} from "express";
import {getParticipantById} from "../models/participants";
import {getSantaPairs} from "../services/santa";

const santa = Router();

santa.get('/', (req, res) => {
    res.render('index');
});

santa.get('/:year/:group', async (req, res) => {
    try {
        const {group, year} = req.params;
        const id = req.query.id as string;
        if (!id) {
            return res.render('404');
        }

        const participant = await getParticipantById(id);
        if (!participant) {
            return res.render('pages/santa/unknownParticipant');
        }

        if (!participant.groups.find((entry) => entry.name === group) === undefined) {
            return res.render('pages/santa/notGroupOf', {
                group,
                participant
            });
        }

        const {name: giver} = participant;
        const pairs = await getSantaPairs(group, parseInt(year, 10));
        const receiver = pairs.get(giver);

        res.render('pages/santa/assignment', {
            year,
            group,
            giver,
            receiver,
        });
    } catch (error) {
        console.error(error.message);

        return res.status(500)
            .render('500')
    }
})

export default santa;
