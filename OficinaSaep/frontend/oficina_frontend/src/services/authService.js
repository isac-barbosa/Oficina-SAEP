import api from './api';

export async function login(email, senha) {
    const response = await api.post('/auth/login', {
        email,
        password: senha,
    });

    const { token } = response.data;
    const user = normalizeUser(response.data.user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return user ? normalizeUser(user) : null;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
}

function normalizeUser(user) {
    return {
        ...user,
        nome: user.nome ?? user.name,
        cargo: user.cargo ?? user.role,
    };
}
