import { prisma } from "../app";
import { subtle } from "crypto";
import { NotificationMethod, NotificationScheduleType, UserPermissions } from "./userTypes";

const defaultNotificationSchedule = {
    contactType: [NotificationMethod.SMS],
    frequency: NotificationScheduleType.WEEKLY
}

export async function AddRootUser(name: string, email: string, phoneNumber: string) {
    const key = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
    const keyData = await subtle.exportKey('jwk', key)

    const [user, apiKey] = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name,
                email,
                phone: phoneNumber,
            }
        })
        const apiKey = await tx.key.create({
            data: {
                id: keyData.k as string,
                userId: user.id,
                permissions: Object.keys(UserPermissions),
            }
        })
        await tx.notificationSchedule.create({
            data: {
                userId: user.id,
                ...defaultNotificationSchedule
            }
        })

        return [user, apiKey]
    })

    return { user, apiKey }
}

export async function GetUserById(id: string) {
    return await prisma.user.findUnique({
        where: {
            id
        }
    })
}

