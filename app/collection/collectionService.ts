import { prisma } from "../app";

export enum CollectionAction {
    increment = "increment",
    decrement = "decrement"
}

const CollectionHistoryAction = {
    [CollectionAction.increment]: 'spent',
    [CollectionAction.decrement]: 'recovered',
}


export async function CreateCollection(userId: string, name: string, budget: number) {

    const collection = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: {
                id: userId
            },
            data: {
                operations: { increment: 1 },
                lastOperationAt: new Date()
            }
        })

        const collection = await tx.collection.create({
            data: {
                name,
                userId: user.id,
                budget
            }
        })

        return collection
    })


    return collection
}

export async function UpdateCollectionBalance(userId: string, name: string, value: number, action: CollectionAction) {

    const collection = prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: {
                id: userId
            },
            data: {
                operations: { increment: 1 },
                lastOperationAt: new Date()
            }
        })


        const collection = await tx.collection.findFirstOrThrow({
            where: { userId: user.id, name }
        })
        const updatedCollection = await tx.collection.update({
            where: {
                id: collection.id
            },
            data: {
                balance: action === CollectionAction.decrement ? { decrement: value } : { increment: value },

            }
        })

        await tx.collectionHistory.create({
            data: {
                collectionId: collection.id,
                action: CollectionHistoryAction[action],
                balance: value,
                budget: collection.budget - updatedCollection.balance
            }
        })

        return updatedCollection
    })
    return collection
}

export async function GetCollectionByNameAndUser(userId: string, name: string) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    const collection = await prisma.collection.findFirstOrThrow({
        where: {
            userId: user.id,
            name: name.toLowerCase()
        }
    })

    return collection
}

export async function CollectionTransactions(userId: string, name: string, limit: number = 10) {

    const transactions = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: {
                id: userId
            },
            data: {
                operations: { increment: 1 },
                lastOperationAt: new Date()
            }
        })

        const collection = await tx.collection.findFirstOrThrow({
            where: {
                userId: user.id,
                name: name.toLowerCase()
            }
        })

        return await tx.collectionHistory.findMany({
            where: {
                collectionId: collection.id,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })

    })


    return transactions
}