import { DataTypes, Model } from 'sequelize'
import sequelizeConnection from '../config'

import Product from './Product';
import Order  from './Order';

interface OrderItemAttributes {
  quantity: number;
  ProductId?: number,
  OrderId?: number,
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export type OrderItemInput = Required<OrderItemAttributes>
export type OrderItemOuput = Required<OrderItemAttributes>

class OrderItem extends Model<OrderItemAttributes, OrderItemInput> implements OrderItemAttributes {
    public quantity!: number
    public ProductId!: number
    public OrderId!: number
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
  }
  
  OrderItem.init({
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1
      }
    },
    ProductId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: 'id'
      }
    },
    OrderId: {
      type: DataTypes.INTEGER,
      references: {
        model: Order,
        key: 'id'
      }
    },
  },
   {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true
  })
  
  export default OrderItem