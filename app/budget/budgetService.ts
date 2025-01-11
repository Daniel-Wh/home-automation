import { prisma } from "../app";


export async function getBudgetResults(userId: string) {
    const collections = await prisma.collection.findMany({
        where: {
            userId
        }
    })

    await prisma.user.update({
        where: { id: userId },
        data: { operations: { increment: 1 }, lastOperationAt: new Date() }
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
    const { totalBudget, totalSpent } = await getBudgetResults(userId)

    await prisma.collection.updateMany({
        where: {
            userId
        },
        data: {
            balance: { set: 0 }
        }
    })

    await prisma.user.update({
        where: { id: userId },
        data: {
            operations: { increment: 1 },
            lastOperationAt: new Date()
        }
    })

    const results = { message: `${totalSpent} dollars spent of allotted ${totalBudget}. All collections set to 0 dollar balance` }

    return results
}