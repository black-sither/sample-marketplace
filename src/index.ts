import express, { Request,Response,NextFunction,Express } from 'express';
import helmet from 'helmet';

import * as dotenv from "dotenv";
dotenv.config();

import authRrouter from './routes/auth';
import buyerRouter from './routes/buyer';
import sellerRouter from './routes/seller';
import auth from './lib/middlewares/authMiddleware'
import dbinit from './db/init'

const app :Express = express();
const authStratergy:string = process.env.AUTH_STRATERGY || "jwt" as string;
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// api endpoints

// auth
app.use('/api/auth', authRrouter);

// business logic
app.use('/api/buyer',auth[authStratergy], buyerRouter);
app.use('/api/seller',auth[authStratergy], sellerRouter);

// universal error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
  
    // Set a default status code of 500 if not already set
    if (!res.statusCode || res.statusCode < 400) {
      res.status(500);
    }
  
    // Return a JSON response with the error message and stack trace
    res.json({
        error: "Internal Server Error"
    });
  });

dbinit().then(()=> {
const port = process.env.PORT || 8080;
 app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})

export default app;