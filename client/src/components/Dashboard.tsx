import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardSidebar } from './Sidebar'
import { SidebarProvider } from "@/components/ui/sidebar"
import { PacienteSection } from './sections/PacienteSection'
import { MedicoSection } from './sections/MedicoSection'
import { FarmaceuticoSection } from './sections/FarmaceuticoSection'
import { AdminSection } from './sections/AdminSection'
import { InicioSection } from './sections/InicioSection'
import { BirthDateForm } from './BirthDateForm'
import { DoctorSpecialtyForm } from './DoctorSpecialtyForm'
import { NuevosRegistros } from './admin/NuevosRegistros'

interface DashboardProps {
    userName: string;
    userRole: string;
    token: string;
}

export function Dashboard({ userName, userRole, token }: DashboardProps) {
    const [needsBirthDate, setNeedsBirthDate] = useState(userRole === 'paciente')
    const [needsDoctorSpecialty, setNeedsDoctorSpecialty] = useState(userRole === 'medico')

    useEffect(() => {
        const hasProvidedBirthDate = localStorage.getItem('hasProvidedBirthDate') === 'true'
        setNeedsBirthDate(userRole === 'paciente' && !hasProvidedBirthDate)

        const hasProvidedSpecialty = localStorage.getItem('hasProvidedSpecialty') === 'true'
        setNeedsDoctorSpecialty(userRole === 'medico' && !hasProvidedSpecialty)
    }, [userRole])

    const handleBirthDateSubmit = () => {
        localStorage.setItem('hasProvidedBirthDate', 'true')
        setNeedsBirthDate(false)
    }

    const handleDoctorSpecialtySubmit = () => {
        localStorage.setItem('hasProvidedSpecialty', 'true')
        setNeedsDoctorSpecialty(false)
    }

    if (needsBirthDate) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <BirthDateForm token={token} onSubmitSuccess={handleBirthDateSubmit} />
            </div>
        )
    }

    if (needsDoctorSpecialty) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <DoctorSpecialtyForm token={token} onSubmitSuccess={handleDoctorSpecialtySubmit} />
            </div>
        )
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <DashboardSidebar userName={userName} />
                <main className="flex-1 p-6 overflow-auto">
                    <Routes>
                        <Route path="" element={<InicioSection userName={userName} />} />
                        <Route path="paciente" element={<PacienteSection />} />
                        <Route path="medico" element={<MedicoSection />} />
                        <Route path="farmaceutico" element={<FarmaceuticoSection />} />
                        <Route path="admin" element={<AdminSection />} />
                        <Route path="admin/nuevos-registros" element={<NuevosRegistros token={token} />} />
                    </Routes>
                </main>
            </div>
        </SidebarProvider>
    )
}

