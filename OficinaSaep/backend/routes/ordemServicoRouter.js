import { Router } from "express";

import {
    getAllOrdensServico,
    getOrdemServicoById,
    createOrdemServico,
    updateOrdemServico,
    deleteOrdemServico
} from '../controller/ordemServico.js';

import { authenticate } from "../middlewares/auth.js";

const ordemServicoRouter = Router();

ordemServicoRouter.use(authenticate);

ordemServicoRouter.get('/', getAllOrdensServico);

ordemServicoRouter.get('/:id', getOrdemServicoById);

ordemServicoRouter.post('/', createOrdemServico);

ordemServicoRouter.put('/:id', updateOrdemServico);

ordemServicoRouter.delete('/:id', deleteOrdemServico);

export default ordemServicoRouter;