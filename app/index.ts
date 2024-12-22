import express from 'express';

export const app = express();
app.use(express.json())

import { PrismaClient } from '@prisma/client'
import { createValidator } from 'express-joi-validation';
import { validateKey } from './authmiddleware';
import { UserPostBody, PostUser } from './user/usercontroller';
import { PostCollection, PostCollectionBody, PutCollectionBody, UpdateCollectionValue } from './collection/collectionController';

export const prisma = new PrismaClient().$extends({
    query: {
        $allModels: {
            async $allOperations({ model, query, args }) {
                const before = new Date().getUTCMilliseconds()
                const result = await query(args);
                const after = new Date().getUTCMilliseconds()

                const time = after - before;

                console.info(`query: ${JSON.stringify(args)} took: ${time} ms on model: ${model}`)

                return result

            }
        }
    }
})


const validator = createValidator()


app.get('/health', async (req, res) => {

    res.send({ status: 'ok' })
});


app.post('/user', validateKey, validator.body(UserPostBody), PostUser)
app.post('/collection', validateKey, validator.body(PostCollectionBody), PostCollection)
app.put('/collection', validateKey, validator.body(PutCollectionBody), UpdateCollectionValue)