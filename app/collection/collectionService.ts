import { prisma } from "../app";

export enum CollectionAction {
    increment = "increment",
    decrement = "decrement"
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
        return await tx.collection.update({
            where: {
                id: collection.id
            },
            data: {
                balance: action === CollectionAction.decrement ? { decrement: value } : { increment: value }
            }
        })
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