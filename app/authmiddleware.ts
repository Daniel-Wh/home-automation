import { Request, Response, NextFunction } from 'express'
import { prisma } from './app'

export async function validateKey(req: Request, res: Response, next: NextFunction) {
    const key = req.headers['x-api-key']
    const { userId } = req.body

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
            const apiKey = await prisma.key.findUniqueOrThrow({
                where: {
                    id: key as string,
                    deletedAt: null,
                    userId
                }
            })
            req.body.apiKey = apiKey
            next()
        } catch (error) {
            res.status(401).json({ message: 'failed to authenticate' })
        }

    }
}

export function requireScope(scope: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { apiKey } = req.body
        if (Object.keys(apiKey).length < 1 || !apiKey.permissions.some((p: string) => p === scope)) {
            res.status(403).json({ message: 'forbidden' })
        }
        delete req.body.apiKey
        next()
    }
}  