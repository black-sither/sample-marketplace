import { Router } from 'express';

import { getOrders, createCatalog } from '../controllers/seller';

const sellerRrouter = Router();

sellerRrouter.post('/create-catalog', createCatalog)

sellerRrouter.get('/orders', getOrders)

export default sellerRrouter;