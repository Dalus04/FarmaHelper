import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardSidebar } from './Sidebar'
import { SidebarProvider } from "@/components/ui/sidebar"
import { PacienteSection } from './sections/PacienteSection'
import { MedicoSection } from './sections/MedicoSection'
import { FarmaceuticoSection } from './sections/FarmaceuticoSection'
import { AdminSection } from './sections/AdminSection'

export function Dashboard() {
    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <DashboardSidebar />
                <main className="flex-1 p-6 overflow-auto">
                    <Routes>
                        <Route path="paciente" element={<PacienteSection />} />
                        <Route path="medico" element={<MedicoSection />} />
                        <Route path="farmaceutico" element={<FarmaceuticoSection />} />
                        <Route path="admin" element={<AdminSection />} />
                        <Route path="" element={<Navigate to="paciente" replace />} />
                    </Routes>
                </main>
            </div>
        </SidebarProvider>
    )
}

