import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill } from 'lucide-react'
import { registerUser } from '../api/auth'
import { useToast } from '@/hooks/use-toast'

export function RegisterForm() {
    const [formData, setFormData] = useState({
        dni: '',
        email: '',
        contraseña: '',
        nombre: '',
        apellido: '',
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
            const response = await registerUser(formData)
            console.log('Registration successful:', response)
            toast({
                title: "Registro exitoso",
                description: `Bienvenido, ${formData.nombre}. Ya puedes iniciar sesión.`,
            })
            // Aquí puedes redirigir al usuario a la página de inicio de sesión
        } catch (error) {
            console.error('Registration error:', error)
            toast({
                title: "Error de registro",
                description: error instanceof Error ? error.message : "Ocurrió un error desconocido",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                    <Pill className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-bold text-center">Registro en FarmaHelper</CardTitle>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                    Ingrese sus datos para crear una cuenta
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                            id="dni"
                            name="dni"
                            type="text"
                            placeholder="Ingrese su DNI"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Ingrese su email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contraseña">Contraseña</Label>
                        <Input
                            id="contraseña"
                            name="contraseña"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={formData.contraseña}
                            onChange={handleChange}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            type="text"
                            placeholder="Ingrese su nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input
                            id="apellido"
                            name="apellido"
                            type="text"
                            placeholder="Ingrese su apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            placeholder="Ingrese su teléfono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

