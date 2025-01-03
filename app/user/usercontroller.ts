import { Request, Response } from "express";
import Joi from 'joi'
import { AddRootUser } from "./userService";

export const UserPostBody = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().regex(/^[0-9]{10}$/).required()
})



export async function PostUser(req: Request, res: Response) {

    try {
        const { name, email, phoneNumber } = req.body
        const user = await AddRootUser(name, email, phoneNumber)

        res.status(201).json({ message: 'user created', user: { ...user } })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }

}