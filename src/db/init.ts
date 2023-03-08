import sequelizeConnection from './config'
import associate from './associations'
const isDev = process.env.NODE_ENV === 'development'

const dbInit = async () => {
  await associate();
  await sequelizeConnection.sync({ alter: isDev })
}
export default dbInit 