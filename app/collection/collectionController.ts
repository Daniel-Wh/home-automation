import { Request, Response } from 'express'
import Joi from 'joi'
import { CollectionAction, CreateCollection, GetCollectionByNameAndUser, UpdateCollection } from './collectionService'

export const PostCollectionBody = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    budget: Joi.number().greater(0).required()
})

export const PutCollectionBody = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    value: Joi.number().greater(0).required(),
    action: Joi.string().valid(...Object.values(CollectionAction)).required()
})

export const GetCollectionBody = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required()
})

export async function PostCollection(req: Request, res: Response) {
    try {
        const { name, userId, budget } = req.body
        const collection = await CreateCollection(userId, name, budget)
        res.status(201).json({ message: 'collection created', collection })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}

export async function UpdateCollectionValue(req: Request, res: Response) {
    try {
        const { userId, name, value, action } = req.body

        const collection = await UpdateCollection(userId, name, value, action)
        res.status(201).json({ message: `You have ${collection.budget - collection.balance} dollars remaining on budget item ${collection.name}` })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}

export async function GetCollectionBalance(req: Request, res: Response) {
    try {
        const { userId, name } = req.body
        const collection = await GetCollectionByNameAndUser(userId, name)
        res.status(200).json({ message: `you have ${collection.budget - collection.balance} dollars remaining on budget item ${collection.name}` })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}