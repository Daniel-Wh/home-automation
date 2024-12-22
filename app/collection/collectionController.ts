import { Request, Response } from 'express'
import Joi from 'joi'
import { CollectionAction, CreateCollection, UpdateCollection } from './collectionService'

export const PostCollectionBody = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required()
})

export const PutCollectionBody = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    value: Joi.number().greater(0).required(),
    action: Joi.string().valid(...Object.values(CollectionAction)).required()
})

export async function PostCollection(req: Request, res: Response) {
    try {
        const { name, userId } = req.body
        const collection = await CreateCollection(userId, name)
        res.status(201).json({ message: 'collection created', collection })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}

export async function UpdateCollectionValue(req: Request, res: Response) {
    try {
        const { userId, name, value, action } = req.body

        const collection = await UpdateCollection(userId, name, value, action)
        res.status(201).json({ message: `collection ${name} has been updated`, collection })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}