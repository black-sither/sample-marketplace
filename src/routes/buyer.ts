import { Router } from 'express'

import { createoOrder, listSellers, getSellerCatalog } from '../controllers/buyer';
const buyerRouter = Router();


buyerRouter.get('/list-of-sellers', listSellers)

buyerRouter.get('/seller-catalog/:seller_id', getSellerCatalog)

buyerRouter.post('/create-order/:seller_id', createoOrder)

export default buyerRouter
