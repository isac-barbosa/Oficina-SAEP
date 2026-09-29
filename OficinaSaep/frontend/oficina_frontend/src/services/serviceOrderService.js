import api from './api';

export async function getServiceOrders() {
    const response = await api.get('/ordens-servico');
    return response.data.map(fromApiOrder);
}

export async function getServiceOrderById(id) {
    const response = await api.get(`/ordens-servico/${id}`);
    return fromApiOrder(response.data);
}

export async function createServiceOrder(order) {
    const response = await api.post('/ordens-servico', toApiOrder(order));
    return fromApiOrder(response.data);
}

export async function updateServiceOrder(id, order) {
    const response = await api.put(`/ordens-servico/${id}`, toApiOrder(order));
    return fromApiOrder(response.data);
}

export async function deleteServiceOrder(id) {
    const response = await api.delete(`/ordens-servico/${id}`);
    return response.data;
}

const STATUS_FROM_API = {
    Agendada: 'PENDENTE',
    'Em Andamento': 'EM ANDAMENTO',
    Concluida: 'CONCLUIDO',
    Cancelada: 'CANCELADO',
};

const STATUS_TO_API = Object.fromEntries(
    Object.entries(STATUS_FROM_API).map(([apiStatus, appStatus]) => [appStatus, apiStatus]),
);
STATUS_TO_API.CONCLUIDO = 'Concluida';

function fromApiOrder(order) {
    return {
        ...order,
        clientId: order.clientId ?? order.cliente_id,
        vehicleId: order.vehicleId ?? order.veiculo_id,
        servico: order.servico ?? order.descricao,
        data: String(order.data ?? order.data_agendamento ?? '').slice(0, 10),
        status: STATUS_FROM_API[order.status] ?? order.status,
        valor: Number(order.valor ?? 0),
    };
}

function toApiOrder(order) {
    return {
        ...order,
        cliente_id: order.cliente_id ?? order.clientId,
        veiculo_id: order.veiculo_id ?? order.vehicleId,
        descricao: order.descricao ?? order.servico,
        data_agendamento: order.data_agendamento ?? order.data,
        status: STATUS_TO_API[order.status] ?? order.status,
    };
}
