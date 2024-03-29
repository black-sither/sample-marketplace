import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

import Seller from './Seller'

import {
  HasOneCreateAssociationMixin
} from 'sequelize';


interface UserAttributes {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export type UserInput = Optional<UserAttributes, 'id'>
export type UserOuput = Required<UserAttributes>

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number
    public username!: string
    public password!: string
  
    declare public createSeller: HasOneCreateAssociationMixin<Seller>;
    declare public getSeller: HasOneCreateAssociationMixin<Seller>;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
  })
  
  export default User