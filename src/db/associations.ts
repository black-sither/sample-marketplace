import Order from './models/Order'
import OrderItem from './models/OrderItem'
import Product from './models/Product'
import Seller from './models/Seller'
import User from './models/User'

const associate =  async () => {
  User.hasMany(Order);
  Order.hasMany(OrderItem)
 
  // User Seller associations
  User.hasOne(Seller,{
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
      }
  });
  Seller.belongsTo(User);


  Seller.hasMany(Product,{
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
      }
  });
  Product.belongsTo(Seller);

  Product.belongsToMany(Order,{ through: OrderItem })
  Order.belongsToMany(Product,{ through: OrderItem })
  }

  export default associate