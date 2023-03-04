import express, { Express } from 'express';
import helmet from 'helmet';
import auth from './routes/auth';

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

app.listen(8080, () => console.log('Example app listening on port 3000!'));
