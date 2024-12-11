import {prisma} from '../services/database';
import {Group} from "@prisma/client";

export const getParticipantById = async (id: string) => {
    return prisma.participant.findUnique({
        include: {
            groups: true
        },
        where: {
            id
        }
    });
}

export const getParticipantsForGroup = async (group: Group) => {
    return prisma.participant.findMany({
        include: {
            excludes: true,
        },
        where: {
            groups: {
                some: {
                    id: group.id
                }
            }
        }
    });
}
