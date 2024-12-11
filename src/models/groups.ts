import {prisma} from '../services/database';

export const getGroups = async () => {
    return prisma.group.findMany();
}

export const getGoupByName = async (name: string) => {
    return prisma.group.findFirst({
        where: {
            name
        }
    });
}
