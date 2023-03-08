import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../db/models/User'
import bcrypt from "bcrypt";
import { successResponse, errorResponse } from '../lib/apiout';
import { ValidationError } from '../lib/errors';

const register = async (req: Request, res: Response) => {
    try {
    const {username,password,isSeller} = req.body;
    const oldUser = await User.findOne({
        where: {
          username: username,
        },
      });

    if (oldUser) {
      // return res.status(409).send("User Already Exist. Please Login");
      throw new ValidationError('User Already Exist. Please Login',409)
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
    return successResponse(201, { token,id:user.id }, res);
    // return res.status(201).json({ token,id:user.id });
    }
    catch(err){
      console.log(err)
      return errorResponse(err as Error, res);
    }
}

const login = async (req: Request, res: Response) => {
    try {
        // Get user input
        const {username,password} = req.body;
    
        // Validate user input
        if (!(username && password)) {
          throw new ValidationError('Missing Inputs for Login',400) 
          // res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({
            where: {
              username: username,
            },
          });
    
        if (user && (await bcrypt.compare(password, user.password))) {
        const private_key:Secret = process.env.TOKEN_KEY as string;
          const token = jwt.sign(
            { username: username,id: user.id},
            private_key,
            {
              expiresIn: "2h",
            }
          );
          return successResponse(200, { token }, res);
          // return res.status(200).json({ token });
        }
        return errorResponse(new ValidationError('Invalid Credentials',400),res)
        // return res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err)
        return errorResponse(err as Error, res);
      }
}

export {
    register,
    login,
}