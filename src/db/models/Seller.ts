import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

interface SellerAttributes {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export type SellerInput = Optional<SellerAttributes, 'id'>
export type SellerOuput = Required<SellerAttributes>

class Seller extends Model<SellerAttributes, SellerInput> implements SellerAttributes {
    public id!: number
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
  }
  
  Seller.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  }, {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true
  })

  export default Seller