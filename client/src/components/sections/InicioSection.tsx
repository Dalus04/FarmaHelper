import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InicioSectionProps {
    userName: string;
}

export function InicioSection({ userName }: InicioSectionProps) {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Inicio</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Bienvenido a FarmaHelper</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Hola, {userName}. Bienvenido al sistema de gestión de recetas médicas.</p>
                </CardContent>
            </Card>
            {/* Add more dashboard content here */}
        </div>
    )
}

