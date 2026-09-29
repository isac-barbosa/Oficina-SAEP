import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { createClient, deleteClient, getClients, updateClient } from '../services/clientService'
import { getCurrentUser, login as loginRequest, logout as clearSession } from '../services/authService'
import { createServiceOrder, deleteServiceOrder, getServiceOrders, updateServiceOrder } from '../services/serviceOrderService'
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from '../services/vehicleService'

const GarageContext = createContext(null)

export function GarageProvider({ children }) {
    const [user, setUser] = useState(getCurrentUser)
    const [clients, setClients] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [orders, setOrders] = useState([])

    const refresh = useCallback(async () => {
        if (!localStorage.getItem('token')) return
        const [clientList, vehicleList, orderList] = await Promise.all([
            getClients(), getVehicles(), getServiceOrders(),
        ])
        setClients(clientList)
        setVehicles(vehicleList)
        setOrders(orderList)
        setUser(getCurrentUser())
    }, [])

    useEffect(() => {
        refresh().catch((error) => console.error('Não foi possível carregar os dados da oficina.', error))
    }, [refresh])

    const login = useCallback(async (email, password) => {
        const result = await loginRequest(email, password)
        setUser(result.user)
        await refresh()
        return result
    }, [refresh])

    const logout = useCallback(() => {
        clearSession()
        setUser(null)
        setClients([])
        setVehicles([])
        setOrders([])
    }, [])

    const saveClient = useCallback(async (client) => {
        const saved = client.id
            ? await updateClient(client.id, client)
            : await createClient(client)
        await refresh()
        return saved
    }, [refresh])
    const removeClient = useCallback(async (id) => { await deleteClient(id); await refresh() }, [refresh])

    const saveVehicle = useCallback(async (vehicle) => {
        const saved = vehicle.id
            ? await updateVehicle(vehicle.id, vehicle)
            : await createVehicle(vehicle)
        await refresh()
        return saved
    }, [refresh])
    const removeVehicle = useCallback(async (id) => { await deleteVehicle(id); await refresh() }, [refresh])

    const saveOrder = useCallback(async (order) => {
        const saved = order.id
            ? await updateServiceOrder(order.id, order)
            : await createServiceOrder(order)
        await refresh()
        return saved
    }, [refresh])
    const removeOrder = useCallback(async (id) => { await deleteServiceOrder(id); await refresh() }, [refresh])

    const value = useMemo(() => ({
        user, clients, vehicles, orders, login, logout, refresh,
        saveClient, removeClient, saveVehicle, removeVehicle, saveOrder, removeOrder,
    }), [user, clients, vehicles, orders, login, logout, refresh, saveClient, removeClient, saveVehicle, removeVehicle, saveOrder, removeOrder])

    return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>
}

export function useGarage() {
    const context = useContext(GarageContext)
    if (!context) throw new Error('useGarage deve ser usado dentro de GarageProvider.')
    return context
}

export function useAuth() {
    const { user, login } = useGarage()
    return { user, ready: true, login }
}
