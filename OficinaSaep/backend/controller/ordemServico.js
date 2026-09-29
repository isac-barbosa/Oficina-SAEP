import db from '../config/database.js'

export async function getAllOrdensServico(req, res) {
    try {
        const [ordens] = await db.query("SELECT id, cliente_id AS clientId, veiculo_id AS vehicleId, descricao AS servico, valor, DATE_FORMAT(data_agendamento, '%Y-%m-%d') AS data, status FROM ordens_servicos");
        res.json(ordens);
    } catch (error) {
        console.error('Erro ao buscar ordens de serviço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function getOrdemServicoById(req, res) {
    const { id } = req.params;
    try {
        const [ordem] = await db.query("SELECT id, cliente_id AS clientId, veiculo_id AS vehicleId, descricao AS servico, valor, DATE_FORMAT(data_agendamento, '%Y-%m-%d') AS data, status FROM ordens_servicos WHERE id = ?", [id]);
        if (ordem.length === 0) {
            return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
        }
        res.json(ordem[0]);
    } catch (error) {
        console.error('Erro ao buscar ordem de serviço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function createOrdemServico(req, res) {
    const { cliente_id, veiculo_id, clientId, vehicleId, data_agendamento, data_inicio, data, data_fim, status, descricao, servico, valor } = req.body;
    const cliente = cliente_id ?? clientId;
    const veiculo = veiculo_id ?? vehicleId;
    const agendamento = data_agendamento ?? data_inicio ?? data;
    const descricaoOrdem = descricao ?? servico;
    try {
        const [result] = await db.query('INSERT INTO ordens_servicos (cliente_id, veiculo_id, descricao, valor, data_agendamento, status) VALUES (?, ?, ?, ?, ?, ?)', [cliente, veiculo, descricaoOrdem, valor ?? 0, agendamento, status ?? 'Agendada']);
        res.status(201).json({ id: result.insertId, cliente_id: cliente, veiculo_id: veiculo, descricao: descricaoOrdem, valor: valor ?? 0, data_agendamento: agendamento, status: status ?? 'Agendada' });
    } catch (error) {
        console.error('Erro ao criar ordem de serviço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function updateOrdemServico(req, res) {
    const { id } = req.params;
    const { cliente_id, veiculo_id, clientId, vehicleId, data_agendamento, data_inicio, data, status, descricao, servico, valor } = req.body;
    const cliente = cliente_id ?? clientId;
    const veiculo = veiculo_id ?? vehicleId;
    const agendamento = data_agendamento ?? data_inicio ?? data;
    const descricaoOrdem = descricao ?? servico;
    try {
        const [ordem] = await db.query('SELECT * FROM ordens_servicos WHERE id = ?', [id]);
        if (ordem.length === 0) {
            return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
        }
        await db.query('UPDATE ordens_servicos SET cliente_id = ?, veiculo_id = ?, descricao = ?, valor = ?, data_agendamento = ?, status = ? WHERE id = ?', [cliente, veiculo, descricaoOrdem, valor ?? 0, agendamento, status, id]);
        res.json({ id, cliente_id: cliente, veiculo_id: veiculo, descricao: descricaoOrdem, valor: valor ?? 0, data_agendamento: agendamento, status });
    } catch (error) {
        console.error('Erro ao atualizar ordem de serviço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function deleteOrdemServico(req, res) {
    const { id } = req.params;
    try {
        const [ordem] = await db.query('SELECT * FROM ordens_servicos WHERE id = ?', [id]);
        if (ordem.length === 0) {
            return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
        }
        await db.query('DELETE FROM ordens_servicos WHERE id = ?', [id]);
        res.json({ message: 'Ordem de serviço excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir ordem de serviço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function getAllOrdensServicoByData(req, res) {
    const { data } = req.params;
    try {
        const [ordens] = await db.query('SELECT * FROM ordens_servicos WHERE DATE(data_agendamento) = ?', [data]);
        res.json(ordens);
    } catch (error) {
        console.error('Erro ao buscar ordens de serviço por data:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function getAllOrdensServicoByClienteAndVeiculo(req, res) {
    const { cliente_id, veiculo_id } = req.params;
    try {
        const [ordens] = await db.query('SELECT * FROM ordens_servicos WHERE cliente_id = ? AND veiculo_id = ?', [cliente_id, veiculo_id]);
        res.json(ordens);
    } catch (error) {
        console.error('Erro ao buscar ordens de serviço por cliente e veículo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
