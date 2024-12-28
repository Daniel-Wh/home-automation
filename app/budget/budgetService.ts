import { prisma } from "../app";


export async function getBudgetResults(userId: string) {
    const collections = await prisma.collection.findMany({
        where: {
            userId
        }
    })

    let totalBudget = 0
    let totalSpent = 0

    const results = collections.map(result => {
        const collection = result.name
        const finalBalance = result.budget - result.balance

        totalBudget += result.budget
        totalSpent += result.balance

        return `collection ${collection} has a remaining balance of ${finalBalance} dollars`
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

    const results = { message: `${collections.count} collections set to 0 balance` }

    return results
}