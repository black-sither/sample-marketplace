import jwt, {Secret} from 'jsonwebtoken';
import {Request,Response,NextFunction } from 'express';

const verifyToken = (req: Request, res:Response , next: NextFunction):void|Response => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const private_key:Secret = process.env.TOKEN_KEY as string;
      const decoded = jwt.verify(token, private_key);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };

const authStratergies:{ [key: string]: any} = {"jwt" : verifyToken}
export default authStratergies;