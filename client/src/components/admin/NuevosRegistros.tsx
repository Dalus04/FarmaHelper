import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegistrarMedico } from './RegistrarMedico'
import { RegistrarFarmaceutico } from './RegistrarFarmaceutico'
import { RegistrarAdministrador } from './RegistrarAdministrador'

interface NuevosRegistrosProps {
    token: string;
}

export function NuevosRegistros({ token }: NuevosRegistrosProps) {
    const [activeTab, setActiveTab] = useState("medico")

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Nuevos Registros</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="medico">Médico</TabsTrigger>
                    <TabsTrigger value="farmaceutico">Farmacéutico</TabsTrigger>
                    <TabsTrigger value="administrador">Administrador</TabsTrigger>
                </TabsList>
                <TabsContent value="medico">
                    <RegistrarMedico token={token} />
                </TabsContent>
                <TabsContent value="farmaceutico">
                    <RegistrarFarmaceutico token={token} />
                </TabsContent>
                <TabsContent value="administrador">
                    <RegistrarAdministrador token={token} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

