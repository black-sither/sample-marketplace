/* global console */
import sequelizeConnection from '../db/config';
import { Sequelize } from 'sequelize';

import Seller from '../db/models/Seller'
import User from '../db/models/User'
import Product from '../db/models/Product';
import Order from '../db/models/Order'
import OrderItem from '../db/models/OrderItem'


const createoOrder = async (req, res) => {
    // TODO verify after catalog implementation
    // TODO add validation for quantity in itemsList
    try {
        const { id } = req.user;
        const { items } = req.body;
        const itemIds = items.map(item => item.id)
        console.log(itemIds);
        const createdOrder = await sequelizeConnection.transaction(async (t) => {
            const productResult = await Product.findAll({
                attributes: ['id', 'price'], where: {
                    SellerId: req.params['seller_id'],
                    id: {
                        [Sequelize.Op.in]: itemIds
                    }
                }
            },
                { transaction: t });
            const sellerItems = productResult.reduce((acc, item) => {
                acc[item.id] = { price: item.price }
                return acc;
            }, {});

            // Check if any invalid/removed item id is supplied
            const unavailableItems = itemIds.filter((itemId) => !sellerItems[itemId])
            console.log(unavailableItems)
            if (unavailableItems.length > 0)
                return res.status(400).json({ error: "Invalid items requested", unavailableItems, sellerItems }) // TODO throw error here

            const totalPrice = items.reduce((acc, item) => {
                return acc + sellerItems[item.id].price * item.quantity;
            }, 0)

            const order = await Order.create({
                UserId: id,
                SellerId: req.params['seller_id'],
                total: totalPrice
            }, { transaction: t });
            const orderItemEntries = items.map((item) => { return { quantity: item.quantity, ProductId: item.id, OrderId: order.id } })
            await OrderItem.bulkCreate(orderItemEntries, { transaction: t });


            return { orderId: order.id, totalPrice };
        });
        // const output = createdOrder.map(())
        return res.status(201).json({ order: createdOrder });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const listSellers = async (req, res) => {
    try {
        const sellers = await Seller.findAll({ include: User });
        const sellerNames = sellers.map((seller) => {
            return { name: seller.User.username, sellerId: seller.id }
        })
        return res.status(200).json({ sellers: sellerNames });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const getSellerCatalog = async (req, res) => {
    // TODO verify after catalog implementation
    try {
        const products = await Product.findAll({ where: { SellerId: req.params['seller_id'] } })
        const productsresults = products.map((product) => {
            return { "name": product.name, "price": product.price, "productId": product.id }
        })

        return res.status(200).json({ catalog: productsresults });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export {
    createoOrder,
    listSellers,
    getSellerCatalog
}