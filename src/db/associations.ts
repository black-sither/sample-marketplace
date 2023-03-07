import Order from './models/Order'
import OrderItem from './models/OrderItem'
import Product from './models/Product'
import Seller from './models/Seller'
import User from './models/User'

const associate =  async () => {
  User.hasMany(Order,{
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
      }
  });

  // User Seller associations
  User.hasOne(Seller,{
    onDelete: 'CASCADE',
    foreignKey: {
      allowNull: false
      }
    });
    Seller.belongsTo(User);

    
    Order.hasMany(OrderItem,{
      onDelete: 'CASCADE',
      foreignKey: {
          allowNull: false
        }
    })

    Order.belongsTo(Seller,{
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
        }
      });

  // Product associations
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