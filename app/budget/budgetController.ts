import { Request, Response } from "express";
import Joi from "joi";
import { clearBudget, getBudgetResults } from "./budgetService";


export const getCurrentBudgetBody = Joi.object({
    userId: Joi.string().required()
})

export const clearBudgetBody = Joi.object({
    userId: Joi.string().required()
})


export async function getCurrentBudgetStatus(req: Request, res: Response) {
    try {
        const { userId } = req.body

        const { totalBudget, totalSpent, results } = await getBudgetResults(userId)

        res.status(200).json({ message: `You have spent ${totalSpent} dollars of your allotted ${totalBudget} dollars`, results })

    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}

export async function clearCurrentBudget(req: Request, res: Response) {
    try {
        const { userId } = req.body
        const results = await clearBudget(userId)
        res.send(results)
    } catch (error) {
        res.status(500).json({})
    }
}