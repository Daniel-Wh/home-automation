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
import { validateKey } from './authmiddleware';
import { UserPostBody, PostUser } from './user/usercontroller';
import { GetCollectionBalance, GetCollectionBody, PostCollection, PostCollectionBody, PutCollectionBody, UpdateCollectionValue } from './collection/collectionController';
import { getCurrentBudgetBody, getCurrentBudgetStatus } from './budget/budgetController';

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




router.get('/health', async (req, res) => {

    res.send({ status: 'ok' })
});


router.post('/user', validateKey, validator.body(UserPostBody), PostUser)
router.post('/collection', validateKey, validator.body(PostCollectionBody), PostCollection)
router.put('/collection', validateKey, validator.body(PutCollectionBody), UpdateCollectionValue)
router.get('/collection', validateKey, validator.body(GetCollectionBody), GetCollectionBalance)
router.get('/budget', validateKey, validator.body(getCurrentBudgetBody), getCurrentBudgetStatus)
app.use('', router)
if (process.env.NODE_ENV === 'production') {
    app.use('/default', router)
}
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});