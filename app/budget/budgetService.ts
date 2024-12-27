import { prisma } from "../app";


export async function getBudgetResults(userId: string) {
    const collections = await prisma.collection.findMany({
        where: {
            userId
        }
    })

    let totalBudget = 0
    let totalSpent = 0

    const results = collections.map(collection => {
        const column = collection.name
        const finalBalance = collection.budget - collection.balance

        totalBudget += collection.budget
        totalSpent += collection.balance

        return { column, finalBalance }
    })

    return { totalBudget, totalSpent, results }

}


export async function clearBudget(userId: string) {
    const collections = await prisma.collection.updateMany({
        where: {
            userId
        },
        data: {
            balance: { set: 0 }
        }
    })

    return collections
}