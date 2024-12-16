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
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'

interface DashboardProps {
    userName: string;
    userRole: string;
    token: string;
    onLogout: () => void;
    onNotifications: () => void;
}

export function Dashboard({ userName, userRole, token, onLogout, onNotifications }: DashboardProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden min-w-[320px]">
                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <div
                    className={`
            fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0
            ${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'}
          `}
                >
                    <DashboardSidebar
                        userName={userName}
                        userRole={userRole}
                        token={token}
                        onLogout={onLogout}
                        onNotifications={onNotifications}
                        onClose={() => setSidebarOpen(false)}
                    />
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Mobile header */}
                    <header className="flex items-center justify-between px-4 py-4 bg-white border-b lg:hidden">
                        <Button variant="ghost" onClick={toggleSidebar}>
                            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                        <h1 className="text-xl font-semibold">FarmaHelper</h1>
                        <div className="w-6"></div> {/* Spacer for centering */}
                    </header>

                    {/* Main content area */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
                        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 bg-white">
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
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

