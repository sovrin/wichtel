import {prisma} from '../services/database';

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

export const getParticipantsForGroup = async (name: string) => {
    const groupId = await prisma.group.findUnique({
        where: {
            name
        }
    });

    if (!groupId) {
        throw new Error(`Group with name ${name} not found`);
    }

    return prisma.participant.findMany({
        include: {
            excludes: true,
        },
        where: {
            groups: {
                some: {
                    id: groupId.id
                }
            }
        }
    });
}
