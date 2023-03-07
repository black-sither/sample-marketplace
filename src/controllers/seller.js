/* global console */
import sequelizeConnection from '../db/config';

import Seller from '../db/models/Seller'
import User from '../db/models/User'
import Product from '../db/models/Product';
import Order from '../db/models/Order'

const createCatalog = async (req, res) => {
    try {
        const { id } = req.user;
        const { items } = req.body;
        // TODO add validation for items, should have price and name
        const user = await User.findOne({
            where: {
                id: id,
            },
            include: Seller
        });
        const sellerId = user.Seller.id;
        const products = items.map(item => {
            return { SellerId: sellerId, name: item.name, price: item.price }
        })
        const result = await sequelizeConnection.transaction(async (t) => {
            const productResult = await Product.bulkCreate(products, { transaction: t });
            return productResult;
        });
        console.log(result);
        return res.status(201).json({ result });
    }
    catch (err) {
        console.log(err);
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
        return res.status(200).send(orderList);
    } catch (err) {
        console.log(err);
    }
}


export {
    createCatalog,
    getOrders,
}