import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { GarageProvider } from './lib/garage-store'

export function App() {
    return (
        <BrowserRouter>
            <GarageProvider>
                <AppRoutes />
            </GarageProvider>
        </BrowserRouter>
    )
}
