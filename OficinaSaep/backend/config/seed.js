import bcrypt from "bcrypt";
import db from "./database.js";

const clientsSeed = [
  [
    "Lucas Almeida",
    "11111111101",
    "(48) 98876-1201",
    "lucas.almeida@email.com",
    "Rua das Acacias, 145",
  ],
  [
    "Juliana Ferreira",
    "11111111102",
    "(48) 99745-2312",
    "juliana.ferreira@email.com",
    "Avenida Atlantica, 820",
  ],
  [
    "Gustavo Mendes",
    "11111111103",
    "(48) 99134-3423",
    "gustavo.mendes@email.com",
    "Rua Sao Jose, 276",
  ],
  [
    "Camila Barbosa",
    "11111111104",
    "(48) 98456-4534",
    "camila.barbosa@email.com",
    "Rua das Palmeiras, 391",
  ],
  [
    "Bruno Cardoso",
    "11111111105",
    "(48) 99678-5645",
    "bruno.cardoso@email.com",
    "Avenida das Nações, 510",
  ],
  [
    "Larissa Moreira",
    "11111111106",
    "(48) 98765-6756",
    "larissa.moreira@email.com",
    "Rua dos Ipês, 74",
  ],
  [
    "Matheus Gomes",
    "11111111107",
    "(48) 99234-7867",
    "matheus.gomes@email.com",
    "Rua Professor Lima, 188",
  ],
  [
    "Fernanda Martins",
    "11111111108",
    "(48) 98123-8978",
    "fernanda.martins@email.com",
    "Alameda das Flores, 263",
  ],
  [
    "André Carvalho",
    "11111111109",
    "(48) 99567-9089",
    "andre.carvalho@email.com",
    "Rua do Comercio, 437",
  ],
  [
    "Patricia Lopes",
    "11111111110",
    "(48) 98654-0190",
    "patricia.lopes@email.com",
    "Avenida Central, 692",
  ],
];

const vehiclesSeed = [
  {
    cpf: "11111111101",
    plate: "QWE2R34",
    brand: "Hyundai",
    model: "HB20",
    year: 2022,
  },
  {
    cpf: "11111111102",
    plate: "RTY5U67",
    brand: "Chevrolet",
    model: "Onix",
    year: 2023,
  },
  {
    cpf: "11111111103",
    plate: "IOP8A90",
    brand: "Fiat",
    model: "Argo",
    year: 2021,
  },
  {
    cpf: "11111111104",
    plate: "ASD1F23",
    brand: "Nissan",
    model: "Kicks",
    year: 2022,
  },
  {
    cpf: "11111111105",
    plate: "GHJ4K56",
    brand: "Jeep",
    model: "Renegade",
    year: 2020,
  },
  {
    cpf: "11111111106",
    plate: "LZX7C89",
    brand: "Renault",
    model: "Duster",
    year: 2021,
  },
  {
    cpf: "11111111107",
    plate: "VBN2M45",
    brand: "Toyota",
    model: "Yaris",
    year: 2023,
  },
  {
    cpf: "11111111108",
    plate: "PLK6J78",
    brand: "Volkswagen",
    model: "T-Cross",
    year: 2022,
  },
  {
    cpf: "11111111109",
    plate: "HGF9D01",
    brand: "Honda",
    model: "HR-V",
    year: 2020,
  },
  {
    cpf: "11111111110",
    plate: "SDF3G12",
    brand: "Ford",
    model: "Ranger",
    year: 2023,
  },
];

const ordersSeed = [
  {
    plate: "QWE2R34",
    description: "Troca de oleo, filtro e verificacao dos fluidos",
    value: 320,
    date: "2026-10-01 08:30:00",
    status: "Agendada",
  },
  {
    plate: "RTY5U67",
    description: "Revisao completa do sistema de freios",
    value: 560,
    date: "2026-10-01 13:30:00",
    status: "Agendada",
  },
  {
    plate: "IOP8A90",
    description: "Alinhamento, balanceamento e calibragem",
    value: 210,
    date: "2026-10-02 09:00:00",
    status: "Agendada",
  },
  {
    plate: "ASD1F23",
    description: "Substituicao das pastilhas de freio dianteiras",
    value: 690,
    date: "2026-09-22 10:00:00",
    status: "Concluida",
  },
  {
    plate: "GHJ4K56",
    description: "Troca de correia dentada e tensionador",
    value: 1450,
    date: "2026-09-23 08:00:00",
    status: "Concluida",
  },
  {
    plate: "LZX7C89",
    description: "Revisao da suspensao e troca de amortecedores",
    value: 2380,
    date: "2026-09-25 14:00:00",
    status: "Em Andamento",
  },
  {
    plate: "VBN2M45",
    description: "Diagnostico do sistema de injecao eletronica",
    value: 780,
    date: "2026-09-29 09:30:00",
    status: "Em Andamento",
  },
  {
    plate: "PLK6J78",
    description: "Higienizacao interna e limpeza do ar condicionado",
    value: 450,
    date: "2026-10-02 11:00:00",
    status: "Agendada",
  },
  {
    plate: "HGF9D01",
    description: "Troca de bateria e verificacao do sistema eletrico",
    value: 920,
    date: "2026-10-03 08:30:00",
    status: "Agendada",
  },
  {
    plate: "SDF3G12",
    description: "Revisao do sistema de arrefecimento",
    value: 1150,
    date: "2026-10-03 14:30:00",
    status: "Agendada",
  },
  {
    plate: "ASD1F23",
    description: "Troca do fluido de freio e inspeção geral",
    value: 390,
    date: "2026-10-05 09:00:00",
    status: "Agendada",
  },
  {
    plate: "GHJ4K56",
    description: "Troca de oleo do cambio automatico",
    value: 1280,
    date: "2026-10-06 10:30:00",
    status: "Agendada",
  },
  {
    plate: "LZX7C89",
    description: "Troca dos pneus dianteiros e alinhamento",
    value: 1890,
    date: "2026-10-07 13:00:00",
    status: "Agendada",
  },
  {
    plate: "VBN2M45",
    description: "Revisao do sistema de escapamento",
    value: 870,
    date: "2026-10-08 08:00:00",
    status: "Agendada",
  },
];

const connection = await db.getConnection();

try {
  await connection.beginTransaction();

  // Criar ou atualizar usuário administrador
  const passwordHash = await bcrypt.hash("12345678", 10);

  await connection.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        password_hash = VALUES(password_hash),
        role = 'admin'`,
    ["Administrador", "admin@oficina.com", passwordHash],
  );

  // Buscar ID do administrador
  const [users] = await connection.query(
    "SELECT id, email FROM users WHERE email = ?",
    ["admin@oficina.com"],
  );

  if (users.length === 0) {
    throw new Error(
      "Não foi possível localizar o usuário administrador após a gravação.",
    );
  }

  const usuarioId = users[0].id;

  // Criar clientes
  for (const client of clientsSeed) {
    await connection.query(
      `INSERT INTO clientes (name, cpf, telefone, email, endereco)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          telefone = VALUES(telefone),
          email = VALUES(email),
          endereco = VALUES(endereco)`,
      client,
    );
  }

  // Criar veículos
  for (const vehicle of vehiclesSeed) {
    const [clients] = await connection.query(
      "SELECT id FROM clientes WHERE cpf = ?",
      [vehicle.cpf],
    );

    if (clients.length === 0) {
      throw new Error(
        `Cliente do veículo ${vehicle.plate} não encontrado.`,
      );
    }

    await connection.query(
      `INSERT INTO veiculos (cliente_id, placa, marca, modelo, ano)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
          cliente_id = VALUES(cliente_id),
          marca = VALUES(marca),
          modelo = VALUES(modelo),
          ano = VALUES(ano)`,
      [
        clients[0].id,
        vehicle.plate,
        vehicle.brand,
        vehicle.model,
        vehicle.year,
      ],
    );
  }

  // Criar ordens de serviço
  for (const order of ordersSeed) {
    const [vehicles] = await connection.query(
      "SELECT id, cliente_id FROM veiculos WHERE placa = ?",
      [order.plate],
    );

    if (vehicles.length === 0) {
      throw new Error(
        `Veículo ${order.plate} da ordem de serviço não encontrado.`,
      );
    }

    const vehicle = vehicles[0];

    const [existing] = await connection.query(
      `SELECT id
       FROM ordens_servicos
       WHERE veiculo_id = ?
       AND descricao = ?
       AND data_agendamento = ?`,
      [vehicle.id, order.description, order.date],
    );

    if (existing.length === 0) {
      await connection.query(
        `INSERT INTO ordens_servicos
         (cliente_id, veiculo_id, usuario_id, descricao, valor, data_agendamento, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          vehicle.cliente_id,
          vehicle.id,
          usuarioId,
          order.description,
          order.value,
          order.date,
          order.status,
        ],
      );
    } else {
      await connection.query(
        `UPDATE ordens_servicos
         SET cliente_id = ?,
             usuario_id = ?,
             valor = ?,
             status = ?
         WHERE id = ?`,
        [
          vehicle.cliente_id,
          usuarioId,
          order.value,
          order.status,
          existing[0].id,
        ],
      );
    }
  }

  await connection.commit();

  console.log(
    "Seed concluído. Login inicial: admin@oficina.com / 12345678",
  );
} catch (error) {
  await connection.rollback();

  console.error("Erro ao popular banco:", error.message);

  process.exitCode = 1;
} finally {
  connection.release();
  await db.end();
}