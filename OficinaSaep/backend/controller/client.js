import db from '../config/database.js'

export async function getAllClients(req, res) {
    try {
        const [clients] = await db.query('SELECT id, name AS nome, cpf, telefone, email, endereco FROM clientes');
        res.json(clients);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function getClientById(req, res) {
    const { id } = req.params;
    try {
        const [client] = await db.query('SELECT id, name AS nome, cpf, telefone, email, endereco FROM clientes WHERE id = ?', [id]);
        if (client.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json(client[0]);
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function createClient(req, res) {
    const { name, nome, cpf, telefone, email, endereco } = req.body;
    const clientName = name ?? nome;
    try {
        const [result] = await db.query('INSERT INTO clientes (name, cpf, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)', [clientName, cpf, telefone, email, endereco]);
        res.status(201).json({ id: result.insertId, name: clientName, nome: clientName, cpf, telefone, email, endereco });
    } catch (error){
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function updateClient(req, res) {
    const { id } = req.params;
    const { name, nome, cpf, telefone, email, endereco } = req.body;
    const clientName = name ?? nome;
    try {
        const [result] = await db.query('UPDATE clientes SET name = ?, cpf = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?', [clientName, cpf, telefone, email, endereco, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json({ id, name: clientName, nome: clientName, cpf, telefone, email, endereco });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export async function deleteClient(req, res) {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
