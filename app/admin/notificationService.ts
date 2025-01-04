
import { prisma } from "../app";
import { getBudgetResults } from "../budget/budgetService";
import { NotificationMethod, NotificationScheduleType } from "../user/userTypes";
import { Twilio } from "twilio";

const currentlySupportedContactMethods = [NotificationMethod.SMS]

export class NotificationService {
    private readonly client;
    private readonly accountSid = process.env.TWILIO_ACCOUNT_SID
    private readonly authToken = process.env.TWILIO_AUTH_TOKEN
    private readonly fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    constructor() {
        this.client = new Twilio(this.accountSid, this.authToken)
    }

    async createTextMessage(body: string, toPhoneNumber: string) {
        try {
            await this.client.messages.create({
                body,
                from: this.fromPhoneNumber,
                to: toPhoneNumber
            })
        } catch (error) {
            console.error(`error sending text message: `, error)
            throw (error)
        }
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

            console.log('sending messages to users:', usersToSendTo)

            await Promise.all(usersToSendTo.map(async user => {
                const { totalBudget, totalSpent, results } = await getBudgetResults(user.id)
                let body = `You have spent ${totalSpent} dollars of your allotted ${totalBudget}.`
                results.every((result) => body = body + `\n${result}`)

                await this.createTextMessage(body, `+1${user.phone}`)
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        operations: { increment: 1 }
                    }
                })

            }))

        }
    }
}


