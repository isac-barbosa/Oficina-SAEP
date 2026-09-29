import bcrypt from 'bcrypt'
import db from './database.js'

const clientsSeed = [
    ['Carlos Oliveira', '00000000001', '(48) 99999-1111', 'carlos@email.com', 'Rua das Flores, 100'],
    ['Ana Pereira', '00000000002', '(48) 98888-2222', 'ana@email.com', 'Rua Central, 200'],
    ['Pedro Santos', '00000000003', '(48) 97777-3333', 'pedro@email.com', 'Avenida Brasil, 300'],
    ['Marina Costa', '00000000004', '(48) 96666-4444', 'marina.costa@email.com', 'Rua dos Pinhais, 67'],
    ['Rafael Nunes', '00000000005', '(48) 95555-5555', 'rafa.nunes@email.com', 'Avenida das Oficinas, 120'],
    ['Bianca Alves', '00000000006', '(48) 94444-6666', 'bianca.alves@email.com', 'Rua do Contorno, 455'],
    ['Davi Martins', '00000000007', '(48) 93333-7777', 'davi.martins@email.com', 'Rua dos Mecânicos, 98'],
    ['Joana Ribeiro', '00000000008', '(48) 92222-8888', 'joana.ribeiro@email.com', 'Alameda do Motor, 24'],
    ['Thiago Rocha', '00000000009', '(48) 91111-9999', 'thiago.rocha@email.com', 'Rua do Pistão, 310'],
    ['Helena Duarte', '00000000010', '(48) 90000-1010', 'helena.duarte@email.com', 'Estrada da Garagem, 15'],
]

const vehiclesSeed = [
    { cpf: '00000000001', plate: 'ABC1D23', brand: 'Toyota', model: 'Corolla', year: 2020 },
    { cpf: '00000000002', plate: 'DEF4G56', brand: 'Honda', model: 'Civic', year: 2021 },
    { cpf: '00000000003', plate: 'HIJ7K89', brand: 'Volkswagen', model: 'Golf', year: 2019 },
    { cpf: '00000000004', plate: 'ERF4G56', brand: 'Ford', model: 'Mustang Fastback', year: 1967 },
    { cpf: '00000000005', plate: 'FGH5J67', brand: 'Dodge', model: 'Charger R/T', year: 1970 },
    { cpf: '00000000006', plate: 'GHI6K78', brand: 'Chevrolet', model: 'Chevelle SS', year: 1972 },
    { cpf: '00000000007', plate: 'JKL7M89', brand: 'Ford', model: 'Maverick GT', year: 1975 },
    { cpf: '00000000008', plate: 'KLM8N90', brand: 'Volkswagen', model: 'Kombi Custom', year: 1974 },
    { cpf: '00000000009', plate: 'LMN9P01', brand: 'Plymouth', model: 'Barracuda', year: 1971 },
    { cpf: '00000000010', plate: 'MNO0Q12', brand: 'Chevrolet', model: 'Opala Caravan', year: 1980 },
]

const ordersSeed = [
    { plate: 'ABC1D23', description: 'Troca de oleo e filtro', value: 250, date: '2026-10-01 09:00:00', status: 'Agendada' },
    { plate: 'DEF4G56', description: 'Revisao do sistema de freios', value: 480, date: '2026-10-02 10:30:00', status: 'Agendada' },
    { plate: 'HIJ7K89', description: 'Alinhamento e balanceamento', value: 180, date: '2026-10-03 14:00:00', status: 'Agendada' },
    { plate: 'ERF4G56', description: 'Preparacao de carburador e acerto de ignicao', value: 1850, date: '2026-09-22 08:30:00', status: 'Concluida' },
    { plate: 'FGH5J67', description: 'Revisao do V8 e troca de juntas', value: 4280, date: '2026-09-24 09:00:00', status: 'Concluida' },
    { plate: 'GHI6K78', description: 'Recuperacao da suspensao dianteira', value: 3650, date: '2026-09-26 13:30:00', status: 'Em Andamento' },
    { plate: 'JKL7M89', description: 'Instalacao de carburador quadrijet', value: 2980, date: '2026-09-29 08:00:00', status: 'Em Andamento' },
    { plate: 'KLM8N90', description: 'Revisao eletrica e conversao para LED', value: 1260, date: '2026-10-01 11:00:00', status: 'Agendada' },
    { plate: 'LMN9P01', description: 'Diagnostico de motor e compressao', value: 680, date: '2026-10-02 14:00:00', status: 'Agendada' },
    { plate: 'MNO0Q12', description: 'Fabricacao de escapamento em inox', value: 3420, date: '2026-10-03 09:30:00', status: 'Agendada' },
    { plate: 'ERF4G56', description: 'Inspecao de freios e fluido DOT 4', value: 740, date: '2026-10-05 10:00:00', status: 'Agendada' },
    { plate: 'FGH5J67', description: 'Instalacao de radiador de alta eficiencia', value: 2190, date: '2026-10-06 13:00:00', status: 'Agendada' },
    { plate: 'GHI6K78', description: 'Polimento tecnico e protecao ceramica', value: 1650, date: '2026-10-07 08:30:00', status: 'Agendada' },
    { plate: 'JKL7M89', description: 'Revisao de cambio e diferencial', value: 3870, date: '2026-10-08 09:00:00', status: 'Agendada' },
]

const connection = await db.getConnection()

try {
    await connection.beginTransaction()

    const passwordHash = await bcrypt.hash('12345678', 10)
    await connection.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?, ?, ?, 'admin')
         ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = 'admin'`,
        ['Administrador', 'admin@oficina.com', passwordHash],
    )

    const [users] = await connection.query('SELECT id, email FROM users WHERE email = ?', ['admin@oficina.com'])
    if (users.length === 0) throw new Error('Não foi possível localizar o usuário administrador após a gravação.')

    for (const client of clientsSeed) {
        await connection.query(
            `INSERT INTO clientes (name, cpf, telefone, email, endereco)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name), telefone = VALUES(telefone), email = VALUES(email), endereco = VALUES(endereco)`,
            client,
        )
    }

    for (const vehicle of vehiclesSeed) {
        const [clients] = await connection.query('SELECT id FROM clientes WHERE cpf = ?', [vehicle.cpf])
        if (clients.length === 0) throw new Error(`Cliente do veículo ${vehicle.plate} não encontrado.`)
        await connection.query(
            `INSERT INTO veiculos (cliente_id, placa, marca, modelo, ano)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE cliente_id = VALUES(cliente_id), marca = VALUES(marca), modelo = VALUES(modelo), ano = VALUES(ano)`,
            [clients[0].id, vehicle.plate, vehicle.brand, vehicle.model, vehicle.year],
        )
    }

    for (const order of ordersSeed) {
        const [vehicles] = await connection.query('SELECT id, cliente_id FROM veiculos WHERE placa = ?', [order.plate])
        if (vehicles.length === 0) throw new Error(`Veículo ${order.plate} da ordem de serviço não encontrado.`)
        const vehicle = vehicles[0]
        const [existing] = await connection.query(
            'SELECT id FROM ordens_servicos WHERE veiculo_id = ? AND descricao = ? AND data_agendamento = ?',
            [vehicle.id, order.description, order.date],
        )
        if (existing.length === 0) {
            await connection.query(
                `INSERT INTO ordens_servicos (cliente_id, veiculo_id, descricao, valor, data_agendamento, status)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [vehicle.cliente_id, vehicle.id, order.description, order.value, order.date, order.status],
            )
        } else {
            await connection.query(
                'UPDATE ordens_servicos SET cliente_id = ?, valor = ?, status = ? WHERE id = ?',
                [vehicle.cliente_id, order.value, order.status, existing[0].id],
            )
        }
    }

    await connection.commit()
    console.log('Seed concluído. Login inicial: admin@oficina.com / 12345678')
} catch (error) {
    await connection.rollback()
    console.error('Erro ao popular banco:', error.message)
    process.exitCode = 1
} finally {
    connection.release()
    await db.end()
}
