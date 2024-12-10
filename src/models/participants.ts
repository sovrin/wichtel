import {prisma} from '../services/database';

export const getParticipants = () => {
    return prisma.participant.findMany({
        include: {
            excludes: true,
            group: true
        }
    });
}

export const getParticipantById = async (id: string) => {
    return prisma.participant.findUnique({
        include: {
            group: true
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
        where: {
            groupId: groupId.id
        }
    });
}

export const createParticipant = async (name: string, groupId: string) => {
    const group = await prisma.group.findUnique({
        where: {
            id: groupId
        }
    });

    if (!group) {
        throw new Error(`Group with id ${groupId} not found`);
    }

    return prisma.participant.create({
        data: {
            name,
            group: {
                connect: {id: group.id}
            },
        }
    });
}
