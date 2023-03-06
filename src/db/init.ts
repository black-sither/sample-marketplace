import sequelizeConnection from './config'
import associate from './associations'
const isDev = process.env.NODE_ENV === 'development'

const dbInit = async () => {
  console.log("reaching here")
  await associate();
  await sequelizeConnection.sync({ alter: isDev })
}
export default dbInit 