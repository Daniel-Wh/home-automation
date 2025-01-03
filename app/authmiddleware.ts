import { Request, Response, NextFunction } from 'express'
import { prisma } from './app'

export async function validateKey(req: Request, res: Response, next: NextFunction) {
    const key = req.headers['x-api-key']

    console.log('key', key)

    if (!key) {
        res.status(401)
    }

    if (key === process.env.API_KEY) {
        next()
    } else {
        if (typeof key !== 'string') {
            res.status(401).json({ message: 'failed to authenticate' })
        }
        try {
            await prisma.key.findUniqueOrThrow({
                where: {
                    id: key as string,
                    deletedAt: null
                }
            })
            next()
        } catch (error) {
            res.status(401).json({ message: 'failed to authenticate' })
        }

    }



}