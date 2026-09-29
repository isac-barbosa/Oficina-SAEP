import db from '../config/database.js'

export async function getAllVeiculos(req, res) {
    try {
        const [veiculos] = await db.query('SELECT * FROM veiculos');
        res.json(veiculos);
    } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function getVeiculoById(req, res) {
    const { id } = req.params;
    try {
        const [veiculo] = await db.query('SELECT * FROM veiculos WHERE id = ?', [id]);
        if (veiculo.length === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }
        res.json(veiculo[0]);
    } catch (error) {
        console.error('Erro ao buscar veículo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function createVeiculo(req, res) {
    const { marca, modelo, ano, placa, cliente_id } = req.body;
    try {
        const [result] = await db.query('INSERT INTO veiculos (marca, modelo, ano, placa, cliente_id) VALUES (?, ?, ?, ?, ?)', [marca, modelo, ano, placa, cliente_id]);
        res.status(201).json({ id: result.insertId, marca, modelo, ano, placa, cliente_id });
    } catch (error) {
        console.error('Erro ao criar veículo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function updateVeiculo(req, res) {
    const { id } = req.params;
    const { marca, modelo, ano, placa, cliente_id } = req.body;
    try {
        const [veiculo] = await db.query('SELECT * FROM veiculos WHERE id = ?', [id]);
        if (veiculo.length === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }
        await db.query('UPDATE veiculos SET marca = ?, modelo = ?, ano = ?, placa = ?, cliente_id = ? WHERE id = ?', [marca, modelo, ano, placa, cliente_id, id]);
        res.json({ id, marca, modelo, ano, placa, cliente_id });
    } catch (error) {
        console.error('Erro ao atualizar veículo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function deleteVeiculo(req, res) {
    const { id } = req.params;
    try {
        const [veiculo] = await db.query('SELECT * FROM veiculos WHERE id = ?', [id]);
        if (veiculo.length === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }
        await db.query('DELETE FROM veiculos WHERE id = ?', [id]);
        res.json({ message: 'Veículo excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function getVeiculosByClienteId(req, res) {
    const { cliente_id } = req.params;
    try {
        const [veiculos] = await db.query('SELECT * FROM veiculos WHERE cliente_id = ?', [cliente_id]);
        res.json(veiculos);
    } catch (error) {
        console.error('Erro ao buscar veículos do cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}