import { prisma } from "../app";

export enum CollectionAction {
    increment = "increment",
    decrement = "decrement"
}


export async function CreateCollection(userId: string, name: string, budget: number) {

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    const collection = await prisma.collection.create({
        data: {
            name,
            userId: user.id,
            budget
        }
    })

    return collection
}

export async function UpdateCollection(userId: string, name: string, value: number, action: CollectionAction) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    const collection = await prisma.collection.findFirstOrThrow({
        where: {
            userId: user.id,
            name
        }
    })

    return await prisma.collection.update({
        where: {
            id: collection.id
        },
        data: {
            balance: action === CollectionAction.decrement ? { decrement: value } : { increment: value }
        }
    })
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