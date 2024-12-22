import { Request, Response } from "express";
import Joi from 'joi'
import { AddUser } from "./userService";

export const UserPostBody = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().regex(/^[0-9]{10}$/).required()
})



export async function PostUser(req: Request, res: Response) {

    try {
        console.log(req.body)
        const { name, email, password, phoneNumber } = req.body
        const user = await AddUser(name, email, phoneNumber)

        res.status(201).json({ message: 'user created', user: { ...user, password: null } })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }



}