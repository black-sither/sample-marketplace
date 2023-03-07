import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../db/models/User'
import bcrypt from "bcrypt";


const register = async (req: Request, res: Response) => {
    try {
    const {username,password,isSeller} = req.body;
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
    const user = await User.create({
        username,
        password: encryptedPassword,
      });
    
    if(isSeller || isSeller === "yes") user.createSeller();
    const private_key:Secret = process.env.TOKEN_KEY as string;
    const token = jwt.sign(
    { username: username,id: user.id },
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
}

const login = async (req: Request, res: Response) => {
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
            { username: username,id: user.id},
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
}

export {
    register,
    login,
}