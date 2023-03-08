import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

interface OrderAttributes {
  id: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export type OrderInput = Optional<OrderAttributes, 'id'>
export type OrderOuput = Required<OrderAttributes>

class Order extends Model<OrderAttributes, OrderInput> implements OrderAttributes {
    public id!: number
    public total!: number
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
  }
  
  Order.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      },
    }
  }, {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true
  })
  
  export default Order