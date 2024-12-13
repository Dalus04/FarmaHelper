import { useState } from 'react'
import { DashboardSidebar } from './Sidebar'
import { SidebarProvider } from "@/components/ui/sidebar"

export function Dashboard() {
    const [activeSection, setActiveSection] = useState('paciente')

    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <DashboardSidebar setActiveSection={setActiveSection} />
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    {activeSection === 'paciente' && <div>Contenido de la sección Paciente</div>}
                    {activeSection === 'medico' && <div>Contenido de la sección Médico</div>}
                    {activeSection === 'farmaceutico' && <div>Contenido de la sección Farmacéutico</div>}
                    {activeSection === 'admin' && <div>Contenido de la sección Admin</div>}
                </main>
            </div>
        </SidebarProvider>
    )
}

