import { Router } from 'express';

const authRrouter = Router();

import { register,login } from '../controllers/auth';

authRrouter.post('/register', register)

authRrouter.post('/login', login)

export default authRrouter;