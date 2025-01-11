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
import { DeleteLastCollectionTransaction, DeleteLastCollectionTransactionBody, GetCollectionBalance, GetCollectionBody, GetCollectionsTransactionsBody, GetCollectionTransactions, PostCollection, PostCollectionBody, PutCollectionBody, PutCollectionBudget, PutCollectionBudgetBody, UpdateCollectionValue } from './collection/collectionController';
import { clearBudgetBody, clearCurrentBudget, getCurrentBudgetBody, getCurrentBudgetStatus } from './budget/budgetController';
import { UserPermissions } from './user/userTypes';
import { NotificationChronPost, SendNotificationPost } from './admin/notificationController';

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
/**
 * apple shortcuts (as of 1/11/25) do not support variables in the URL so I have to have a distinct route for each action
 * I didn't want to use an ACTION parameter in the body because it would complicate the body validation
 */
enum Routes {
    collection = '/collection',
    collectionBalance = '/collection/balance',
    collectionTransactions = '/collection/transactions',
    collectionBudget = '/collection/budget',
    collectionRevert = '/collection/revert',
    budget = '/budget',
    user = '/user',
    notifications = '/admin/notifications'
}

router.get('/health', async (_, res) => {

    res.send({ status: 'ok' })
});
/**
 * Currently apple shortcuts don't support GET requests with a body so I have to use POST/PUT/PATCH/DELETE
 * Alternatively I could use a header to pass the user id as part of the request but I have users already using the body, le sad
 */
router.post(Routes.user, validateKey, validator.body(UserPostBody), PostUser)
router.post(Routes.collection, validateKey, requireScope(UserPermissions.COLLECTION_WRITE), validator.body(PostCollectionBody), PostCollection)
router.put(Routes.collection, validateKey, requireScope(UserPermissions.COLLECTION_WRITE), validator.body(PutCollectionBody), UpdateCollectionValue)
router.post(Routes.collectionBalance, validateKey, requireScope(UserPermissions.COLLECTION_READ), validator.body(GetCollectionBody), GetCollectionBalance)
router.put(Routes.collectionBudget, validateKey, requireScope(UserPermissions.COLLECTION_WRITE), validator.body(PutCollectionBudgetBody), PutCollectionBudget)
router.delete(Routes.collectionRevert, validateKey, requireScope(UserPermissions.COLLECTION_DELETE), validator.body(DeleteLastCollectionTransactionBody), DeleteLastCollectionTransaction)
router.post(Routes.budget, validateKey, requireScope(UserPermissions.BUDGET_READ), validator.body(getCurrentBudgetBody), getCurrentBudgetStatus)
router.delete(Routes.budget, validateKey, requireScope(UserPermissions.BUDGET_DELETE), validator.body(clearBudgetBody), clearCurrentBudget)
router.post(Routes.notifications, validateKey, validator.body(SendNotificationPost), NotificationChronPost)
router.post(Routes.collectionTransactions, validateKey, requireScope(UserPermissions.COLLECTION_READ), validator.body(GetCollectionsTransactionsBody), GetCollectionTransactions)
app.use('', router)
if (process.env.NODE_ENV === 'production') {
    app.use('/default', router)
}
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});