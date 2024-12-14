import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { registerSpecialUser, CreateUserDto } from '../../api/auth'

interface RegistrarAdministradorProps {
    token: string;
}

export function RegistrarAdministrador({ token }: RegistrarAdministradorProps) {
    const [formData, setFormData] = useState<CreateUserDto>({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '',
        rol: 'admin',
        telefono: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await registerSpecialUser(formData, token)
            toast({
                title: "Registro exitoso",
                description: "El administrador ha sido registrado correctamente.",
            })
            setFormData({
                dni: '',
                nombre: '',
                apellido: '',
                email: '',
                contraseña: '',
                rol: 'admin',
                telefono: ''
            })
        } catch (error) {
            toast({
                title: "Error en el registro",
                description: error instanceof Error ? error.message : "Ocurrió un error desconocido",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Registrar Administrador</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input id="dni" name="dni" value={formData.dni} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contraseña">Contraseña</Label>
                        <Input id="contraseña" name="contraseña" type="password" value={formData.contraseña} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrar Administrador'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

