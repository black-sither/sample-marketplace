import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../config'

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
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    paranoid: true
  })
  
  export default User