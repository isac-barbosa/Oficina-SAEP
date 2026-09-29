export const STATUS_LABEL = {
    PENDENTE: 'Pendente',
    'EM ANDAMENTO': 'Em andamento',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0)
}

export function formatDate(value) {
    if (!value) return '—'
    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)
    return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('pt-BR').format(date)
}

export function maskCpf(value = '') {
    const digits = String(value).replace(/\D/g, '').slice(0, 11)
    return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
