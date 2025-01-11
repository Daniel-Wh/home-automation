import { Request, Response } from 'express'
import Joi from 'joi'
import { CollectionAction, CollectionTransactions, CreateCollection, GetCollectionByNameAndUser, UpdateCollectionBalance } from './collectionService'
import { getDayOfTheWeekFromDate, getMonthFromDate, getNormalizedDayOfMonth } from '../shared/DateFormatting'

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

export const GetCollectionsTransactionsBody = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    limit: Joi.number().optional()
})

export async function PostCollection(req: Request, res: Response) {
    try {
        const { name, userId, budget } = req.body
        const normalizedCollectionName = name.toLowerCase()
        const collection = await CreateCollection(userId, normalizedCollectionName, budget)
        res.status(201).json({ message: 'collection created', collection })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong', error })
    }
}

export async function UpdateCollectionValue(req: Request, res: Response) {
    try {
        const { userId, name, value, action } = req.body
        const normalizedCollectionName = name.toLowerCase()
        const collection = await UpdateCollectionBalance(userId, normalizedCollectionName, value, action)
        res.status(201).json({ message: `You have ${collection.budget - collection.balance} dollars remaining on budget item ${collection.name}` })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong', body: req.body })
    }
}

export async function GetCollectionBalance(req: Request, res: Response) {
    try {
        const { userId, name } = req.body
        const normalizedCollectionName = name.toLowerCase()
        const collection = await GetCollectionByNameAndUser(userId, normalizedCollectionName)
        res.status(200).json({ message: `you have ${collection.budget - collection.balance} dollars remaining on budget item ${collection.name}` })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}

export async function GetCollectionTransactions(req: Request, res: Response) {
    try {
        const { userId, name, limit } = req.body
        const normalizedCollectionName = name.toLowerCase()
        const transactions = await CollectionTransactions(userId, normalizedCollectionName, limit)
        let result = ''
        if (transactions.length > 0) {
            transactions.forEach((transaction, index) => {
                const date = new Date(transaction.createdAt)
                result += index === 0 ? '' : ' '
                result += `${transaction.balance} dollars ${transaction.action} on ${getDayOfTheWeekFromDate(transaction.createdAt)} the ${getNormalizedDayOfMonth(transaction.createdAt)}, ${getMonthFromDate(transaction.createdAt)} ${transaction.createdAt.getFullYear()}.`
            })
        } else {
            result = `no transactions found for collection ${name}`
        }

        res.status(200).json({ message: result })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}