import {Router} from "express";
import {getParticipantById} from "../models/participants";
import {getSantaPairs} from "../services/santa";

const santa = Router();

santa.get('/', (req, res) => {
    res.render('index');
});

santa.get('/:year/:group', async (req, res) => {
    const {group, year} = req.params;
    const id = req.query.id as string;

    const participant = await getParticipantById(id);
    if (!participant) {
        return res.render('pages/santa/unknownParticipant');
    }

    if (participant.group.name !== group) {
        return res.render('pages/santa/notGroupOf', {
            group,
            participant
        });
    }

    const {name: giver} = participant;

    try {
        const pairs = await getSantaPairs(group, parseInt(year, 10));
        const receiver = pairs.get(giver);

        res.render('pages/santa/assignment', {
            year,
            group,
            giver,
            receiver,
        });
    } catch (error) {
        res.status(500).send(error.message);

        console.error(error);
    }
})

export default santa;
