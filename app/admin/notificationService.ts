
import { prisma } from "../app";
import { getBudgetResults } from "../budget/budgetService";
import { NotificationMethod, NotificationScheduleType } from "../user/userTypes";

const currentlySupportedContactMethods = [NotificationMethod.EMAIL]

export class NotificationService {

    constructor() {
    }



    async sendNotifications(notificationSchedule: NotificationScheduleType) {
        const notifications = await prisma.notificationSchedule.findMany({
            where: {
                frequency: notificationSchedule,
            }
        })

        const filteredForSupportedNotification = notifications.filter((val) => val.contactType.some((contact) => currentlySupportedContactMethods.includes(contact as NotificationMethod)))

        if (filteredForSupportedNotification.length > 0) {
            const usersToSendTo = await prisma.user.findMany({
                where: {
                    id: {
                        in: filteredForSupportedNotification.map(x => x.userId)
                    }
                }
            })

            console.info('sending messages to users:', usersToSendTo)

            await Promise.all(usersToSendTo.map(async user => {
                const { totalBudget, totalSpent, results } = await getBudgetResults(user.id)
                let body = `You have spent ${totalSpent} dollars of your allotted ${totalBudget}.`
                results.every((result) => body = body + `\n${result}`)

                // send message
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        operations: { increment: 1 },
                        lastOperationAt: new Date()
                    }
                })

            }))

        }
    }
}


