import jwt, {Secret} from 'jsonwebtoken';
import {Request,Response,NextFunction } from 'express';

import { ValidationError } from '../errors';
import { errorResponse } from '../apiout';

const verifyToken = (req: Request, res:Response , next: NextFunction):void|Response => {
  const token =
  req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization?.split("Bearer ")[1];
  if (!token) return errorResponse(new ValidationError('A token is required for authentication',403),res);
      const private_key:Secret = process.env.TOKEN_KEY as string;
      try {
      const decoded = jwt.verify(token, private_key);
      req.user = decoded;
    } catch (err) {
      console.log(err)
      return errorResponse(new ValidationError('Invalid Token',401),res);
    }
    return next();
  };

// adding provision for dynamic auth stratergy via dependency injection
const authStratergies:{ [key: string]: any} = {"jwt" : verifyToken}
export default authStratergies;