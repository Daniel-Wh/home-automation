import { Request, Response } from "express";
import Joi from "joi";
import { getBudgetResults } from "./budgetService";


export const getCurrentBudgetBody = Joi.object({
    userId: Joi.string().required()
})


export async function getCurrentBudgetStatus(req: Request, res: Response) {
    try {
        const { userId } = req.body

        const { totalBudget, totalSpent, results } = await getBudgetResults(userId)

        res.status(200).json({ message: `You have spent ${totalSpent} dollars of your allotted ${totalBudget}` })

    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
    }
}