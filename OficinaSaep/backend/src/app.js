import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "../routes/auth.js"
import clientRouter from "../routes/clientRouter.js"
import veiculoRouter from "../routes/veiculoController.js"
import ordemServicoRouter from "../routes/ordemServicoRouter.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/clientes', clientRouter)
app.use('/api/veiculos', veiculoRouter)
app.use('/api/ordens-servico', ordemServicoRouter)

export default app
