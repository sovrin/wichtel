import {prisma} from '../services/database';

export const getGroups = async () => {
    return prisma.group.findMany();
}

export const createGroup = async (name: string): Promise<unknown> => {
    return prisma.group.create({
        data: {
            name
        }
    });
}

export const deleteGroup = async (id: string): Promise<unknown> => {
    return prisma.group.delete({
        where: {
            id
        }
    });
}


