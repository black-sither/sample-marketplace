/* global console */
import sequelizeConnection from '../db/config';

import Seller from '../db/models/Seller'
import User from '../db/models/User'
import Product from '../db/models/Product';
import Order from '../db/models/Order'

import { ValidationError } from '../lib/errors';

import { successResponse, errorResponse } from '../lib/apiout';

const createCatalog = async (req, res) => {
    // TODO add validation for items, should have price and name
    try {
        const { id } = req.user;
        const { items } = req.body;
        const user = await User.findOne({
            where: {
                id: id,
            },
            include: Seller
        });
        if (!user.Seller)
            throw new ValidationError('Only Sellers are allowed to create catalog', 403)
        const sellerId = user.Seller.id;
        const products = items.map(item => {
            return { SellerId: sellerId, name: item.name, price: item.price }
        })
        const result = await sequelizeConnection.transaction(async (t) => {
            const productResult = await Product.bulkCreate(products, { transaction: t });
            return productResult;
        });
        const output = result.map(product => {
            return { productId: product.id, name: product.name, price: product.price }
        })
        return successResponse(201, { catalog: output }, res);
    } catch (err) {
        console.log(err)
        return errorResponse(err, res);
    }
}

const getOrders = async (req, res) => {
    try {
        const { id } = req.user;
        console.log(id);
        const seller = await Seller.findOne({
            where: {
                UserId: id,
            }
        });
        if (!seller) return res.status(401).send({ error: "API only acessable to sellers" })
        const orderList = await Order.findAll({
            where: {
                SellerId: seller.id,
            }
        });
        const output = orderList.map(order => {
            return {
                orderId: order.id,
                totalPrice: order.total,
                userId: order.UserId,
                sellerId: order.SellerId,
                placedOn: order.ceratedAt
            }
        })
        return successResponse(200, output, res);
    } catch (err) {
        console.log(err)
        return errorResponse(err, res);
    }
}


export {
    createCatalog,
    getOrders,
}