import {xorShift} from "../utils/math";
import {getParticipantsForGroup} from "../models/participants";
import {GENERATOR_SEED} from "../const";
import {Group} from "@prisma/client";

type SecretSantaPairs = Map<string, string>;
type Exclusions = Record<string, string[]>;
type Participants = string[];

export const generateSecretSantaPairs = (
    participants: Participants,
    exclusions: Exclusions,
    seed: number,
    iterations = 0
): SecretSantaPairs => {
    if (participants.length < 2) {
        throw new Error('There must be at least two participants');
    }

    if (iterations > 100) {
        throw new Error('Could not generate pairs');
    }

    const givers = [...participants];
    const receivers = [...participants];
    const pairings: SecretSantaPairs = new Map<string, string>();
    const random = xorShift(seed);

    shuffle(givers);

    function shuffle(array: string[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    for (const giver of givers) {
        shuffle(receivers);

        const possibleReceivers = receivers.filter((receiver) => receiver !== giver)
            .filter((receiver) => !exclusions[giver]?.includes(receiver));

        if (possibleReceivers.length === 0) {
            return generateSecretSantaPairs(
                participants,
                exclusions,
                seed + 100,
                iterations + 1
            );
        }

        const [receiver] = possibleReceivers;
        pairings.set(giver, receiver);

        receivers.splice(receivers.indexOf(receiver), 1);
    }

    return pairings;
};


export const getSantaPairs = async (group: Group, year: number): Promise<SecretSantaPairs> => {
    const participants = await getParticipantsForGroup(group);
    if (participants.length === 0) {
        return new Map<string, string>();
    }

    const participantsNames = participants.map((participant) => participant.name);
    const exclusions = participants.reduce((acc, participant) => {
        acc[participant.name] = participant.excludes.map((exclude) => exclude.name);

        return acc;
    }, {});
    const seed = parseInt(String(GENERATOR_SEED)) + year;

    return generateSecretSantaPairs(participantsNames, exclusions, seed);
}

export const generateLinks = async (group: Group, year: number): Promise<{ name: string, link: string }[]> => {
    const participants = await getParticipantsForGroup(group);
    if (participants.length === 0) {
        return [];
    }

    return participants.map(({id, name}) => {
        const link = `${year}/${group.name}?id=${id}`;

        return {
            name,
            link
        }
    });
}
