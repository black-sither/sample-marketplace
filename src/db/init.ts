import User from './models/User'
const isDev = process.env.NODE_ENV === 'development'

const dbInit = async () => {
  console.log("reaching here")
  await User.sync({ alter: isDev })
}
export default dbInit 