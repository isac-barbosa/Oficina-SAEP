import { Router } from 'express';

import {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} from '../controller/client.js';

import { authenticate } from '../middlewares/auth.js';

const clientRouter = Router();

clientRouter.use(authenticate);

clientRouter.get('/', getAllClients);

clientRouter.get('/:id', getClientById);

clientRouter.post('/', createClient);

clientRouter.put('/:id', updateClient);

clientRouter.delete('/:id', deleteClient);

export default clientRouter
;
