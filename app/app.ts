import express from 'express';
import x from '../node_modules/.prisma/client'
import y from '../node_modules/@prisma/client/'

if (process.env.NODE_ENV !== 'production') {
    console.debug(x, y)
}

export const app = express();
app.use(express.json())
const router = express.Router()

import { PrismaClient } from '@prisma/client'
import { createValidator } from 'express-joi-validation';
import { requireScope, validateKey } from './authmiddleware';
import { UserPostBody, PostUser } from './user/usercontroller';
import { GetCollectionBalance, GetCollectionBody, PostCollection, PostCollectionBody, PutCollectionBody, UpdateCollectionValue } from './collection/collectionController';
import { clearBudgetBody, clearCurrentBudget, getCurrentBudgetBody, getCurrentBudgetStatus } from './budget/budgetController';
import { UserPermissions } from './user/userTypes';

export const prisma = new PrismaClient().$extends({
    query: {

        async $allOperations({ model, query, args }) {
            const before = new Date().getUTCMilliseconds()
            const result = await query(args);
            const after = new Date().getUTCMilliseconds()

            const time = after - before;

            console.info(`query: ${JSON.stringify(args)} took: ${time} ms on model: ${model}`)

            return result

        }

    }
})


const validator = createValidator()

enum Routes {
    collection = '/collection',
    budget = '/budget',
    user = '/user'
}

router.get('/health', async (_, res) => {

    res.send({ status: 'ok' })
});
router.post(Routes.user, validateKey, validator.body(UserPostBody), PostUser)
router.post(Routes.collection, validateKey, requireScope(UserPermissions.COLLECTION_WRITE), validator.body(PostCollectionBody), PostCollection)
router.put(Routes.collection, validateKey, requireScope(UserPermissions.COLLECTION_WRITE), validator.body(PutCollectionBody), UpdateCollectionValue)
router.get(Routes.collection, validateKey, requireScope(UserPermissions.COLLECTION_READ), validator.body(GetCollectionBody), GetCollectionBalance)
router.post(Routes.budget, validateKey, requireScope(UserPermissions.BUDGET_READ), validator.body(getCurrentBudgetBody), getCurrentBudgetStatus)
router.delete(Routes.budget, validateKey, requireScope(UserPermissions.BUDGET_DELETE), validator.body(clearBudgetBody), clearCurrentBudget)
app.use('', router)
if (process.env.NODE_ENV === 'production') {
    app.use('/default', router)
}
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});