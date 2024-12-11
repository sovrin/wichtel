import {Router} from "express";
import {getParticipantById, getParticipantsForGroup} from "../models/participants";
import {getSantaPairs} from "../services/santa";
import {getGoupByName} from "../models/groups";
import {formatDate} from "../utils/date";

const santa = Router();

santa.get('/', (_req, res) => {
    res.render('index');
});

santa.get('/:year/:group', async (req, res) => {
    const {params, query} = req;
    const {group: groupName, year} = params;
    const {id} = query;

    try {
        const group = await getGoupByName(groupName);
        if (!group) {
            return res.render('pages/santa/unknownGroup', {
                group: groupName,
            });
        }

        if (!id) {
            const participants = await getParticipantsForGroup(group);

            return res.render('pages/santa/participants', {
                group,
                year,
                participants
            });
        }

        const participant = await getParticipantById(String(id));
        if (!participant) {
            return res.render('pages/santa/unknownParticipant');
        }

        if (!participant.groups.find((entry) => entry.name === group.name) === undefined) {
            return res.render('pages/santa/notGroupOf', {
                group,
                participant
            });
        }

        const {name: giver} = participant;
        const pairs = await getSantaPairs(group, parseInt(year, 10));
        const receiver = pairs.get(giver);

        res.render('pages/santa/assignment', {
            deadLine: formatDate(new Date(`${year}-${group.deadline}`)),
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
