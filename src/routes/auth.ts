import { Router, Request, Response } from 'express';
const router = Router();

router.post('/register', (req: Request, res: Response) => {
    // TODO implement register logic
    return res.status(201).send({ register: true });
})

router.post('/login', (req: Request, res: Response) => {
    // TODO implement login logic
    return res.status(200).send({ login: true });
})

export default router;