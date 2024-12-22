import { Request, Response, NextFunction } from 'express'

export function validateKey(req: Request, res: Response, next: NextFunction) {
    const key = req.headers['x-api-key']

    if (!key) {
        res.status(401)
    }

    if (key !== process.env.API_KEY) {
        res.status(401).json({ message: 'failed to authenticate' })
    } else {
        next()
    }



}