import { Router,Request, Response} from 'express'
import User from '../db/models/User'

const buyerRouter = Router();

buyerRouter.get('/list-of-sellers',async (req: Request, res: Response) => {
  // get ingredient
  const users = await User.findAll();
  const usernames = users.map((user)=> user.username)
  return res.status(200).json({ users:usernames });
})

export default buyerRouter
