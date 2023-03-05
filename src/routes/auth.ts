import { Router, Request, Response } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import User from '../db/models/User'
import bcrypt from "bcrypt";

const authRrouter = Router();

authRrouter.post('/register', async (req: Request, res: Response) => {
    // TODO implement register logic
    try {
    const {username,password} = req.body;
    const oldUser = await User.findOne({
        where: {
          username: username,
        },
      });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    await User.create({
        username,
        password: encryptedPassword,
      });
    
    const private_key:Secret = process.env.TOKEN_KEY as string;
    const token = jwt.sign(
    { username: username },
    private_key,
    {
        expiresIn: "2h",
    }
    );
    return res.status(201).json({ token });
    }
    catch(err){
        console.log(err);
    }
})

authRrouter.post('/login', async (req: Request, res: Response) => {
    try {
        // Get user input
        const {username,password} = req.body;
    
        // Validate user input
        if (!(username && password)) {
          res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({
            where: {
              username: username,
            },
          });
    
        if (user && (await bcrypt.compare(password, user.password))) {
        const private_key:Secret = process.env.TOKEN_KEY as string;
          // Create token
          const token = jwt.sign(
            { username: username},
            private_key,
            {
              expiresIn: "2h",
            }
          );
          // user
          return res.status(200).json({ token });
        }
        return res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
})

export default authRrouter;