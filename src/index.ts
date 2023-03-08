import express, { Express } from 'express';
import helmet from 'helmet';

import * as dotenv from "dotenv";
dotenv.config();

import authRrouter from './routes/auth';
import buyerRouter from './routes/buyer';
import sellerRouter from './routes/seller';
import auth from './lib/middlewares/Auth'
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
app.use('/api/buyer',auth[authStratergy], buyerRouter);
app.use('/api/seller',auth[authStratergy], sellerRouter);

app.get('/hello',(req,res) =>{return res.status(200).send({"ko":"ok"})})

dbinit().then(()=> {
const port = process.env.PORT || 8080;
 app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})

export default app;