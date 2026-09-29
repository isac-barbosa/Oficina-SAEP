import { Navigate, Route, Routes } from 'react-router-dom'

import Clients from '../pages/Clients'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import ServiceOrders from '../pages/ServiceOrders'
import Vehicles from '../pages/Vehicles'

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token')

    return token ? children : <Navigate to="/" replace />
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/dashboard"
                element={<PrivateRoute><Dashboard /></PrivateRoute>}
            />
            <Route
                path="/clientes"
                element={<PrivateRoute><Clients /></PrivateRoute>}
            />
            <Route
                path="/veiculos"
                element={<PrivateRoute><Vehicles /></PrivateRoute>}
            />
            <Route
                path="/ordens-servico"
                element={<PrivateRoute><ServiceOrders /></PrivateRoute>}
            />
            <Route
                path="/profile"
                element={<PrivateRoute><Profile /></PrivateRoute>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
