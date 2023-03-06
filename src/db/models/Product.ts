import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export type ProductInput = Optional<ProductAttributes, 'id'>
export type ProductOuput = Required<ProductAttributes>

class Product extends Model<ProductAttributes, ProductInput> implements ProductAttributes {
    public id!: number
    public name!: string
    public price!: number
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
  }
  
  Product.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false,
    },
  }, {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true
  })
  
  export default Product