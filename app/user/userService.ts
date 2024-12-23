import { prisma } from "..";


export async function AddUser(name: string, email: string, phoneNumber: string) {
    return await prisma.user.create({
        data: {
            name,
            email,
            phone: phoneNumber
        }
    })
}

