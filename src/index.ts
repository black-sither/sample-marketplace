import express, { Express,Request,Response } from 'express';
import helmet from 'helmet';

import * as dotenv from "dotenv";
dotenv.config();

import auth from './routes/auth';
import User from './db/models/User'
import dbinit from './db/init'

const app :Express = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// api endpoints

// auth
app.use('/api/auth', auth);


dbinit().then(()=> {
 app.listen(8080, () => console.log('Example app listening on port 8080!'));
})
