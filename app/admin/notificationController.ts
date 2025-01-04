import { Request, Response } from "express";
import Joi from "joi";
import { NotificationService } from "./notificationService";
import { NotificationScheduleType } from "../user/userTypes";


export const SendNotificationPost = Joi.object({
    notificationSchedule: Joi.string().valid(...Object.values(NotificationScheduleType)).required()
})


export async function NotificationChronPost(req: Request, res: Response) {
    const { notificationSchedule } = req.body
    const notificationService = new NotificationService()

    try {
        await notificationService.sendNotifications(notificationSchedule)
        res.send(201)
    } catch (error) {
        res.send(500).json({ message: error })
    }
}

