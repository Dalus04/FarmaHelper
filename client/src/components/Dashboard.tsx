import { Routes, Route } from 'react-router-dom'
import { DashboardSidebar } from './Sidebar'
import { SidebarProvider } from "@/components/ui/sidebar"
import { PacienteSection } from './sections/PacienteSection'
import { MedicoSection } from './sections/MedicoSection'
import { FarmaceuticoSection } from './sections/FarmaceuticoSection'
import { AdminSection } from './sections/AdminSection'
import { InicioSection } from './sections/InicioSection'
import { NuevosRegistros } from './admin/NuevosRegistros'
import { UsuariosRegistrados } from './admin/UsuariosRegistrados'

interface DashboardProps {
    userName: string;
    userRole: string;
    token: string;
    onLogout: () => void;
    onNotifications: () => void;
}

export function Dashboard({ userName, userRole, token, onLogout, onNotifications }: DashboardProps) {
    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <DashboardSidebar
                    userName={userName}
                    userRole={userRole}
                    token={token}
                    onLogout={onLogout}
                    onNotifications={onNotifications}
                />
                <main className="flex-1 p-6 overflow-auto">
                    <Routes>
                        <Route path="" element={<InicioSection userName={userName} />} />
                        {userRole === 'paciente' && <Route path="paciente" element={<PacienteSection />} />}
                        {userRole === 'medico' && <Route path="medico" element={<MedicoSection />} />}
                        {userRole === 'farmaceutico' && <Route path="farmaceutico" element={<FarmaceuticoSection />} />}
                        {userRole === 'admin' && (
                            <>
                                <Route path="admin" element={<AdminSection />} />
                                <Route path="admin/nuevos-registros" element={<NuevosRegistros token={token} />} />
                                <Route path="admin/usuarios-registrados" element={<UsuariosRegistrados token={token} />} />
                            </>
                        )}
                    </Routes>
                </main>
            </div>
        </SidebarProvider>
    )
}

