import api from './api';

export async function getVehicles() {
    const response = await api.get('/veiculos');
    return response.data.map(fromApiVehicle);
}

export async function getVehicleById(id) {
    const response = await api.get(`/veiculos/${id}`);
    return fromApiVehicle(response.data);
}

export async function createVehicle(vehicle) {
    const response = await api.post('/veiculos', toApiVehicle(vehicle));
    return fromApiVehicle(response.data);
}

export async function updateVehicle(id, vehicle) {
    const response = await api.put(`/veiculos/${id}`, toApiVehicle(vehicle));
    return fromApiVehicle(response.data);
}

export async function deleteVehicle(id) {
    const response = await api.delete(`/veiculos/${id}`);
    return response.data;
}

function fromApiVehicle(vehicle) {
    return { ...vehicle, clientId: vehicle.clientId ?? vehicle.cliente_id };
}

function toApiVehicle(vehicle) {
    return { ...vehicle, cliente_id: vehicle.cliente_id ?? vehicle.clientId };
}
