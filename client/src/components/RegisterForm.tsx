import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Pill } from 'lucide-react'
import { registerUser } from '../api/auth'
import { useToast } from '@/hooks/use-toast'
import { FormLayout } from './common/FormLayout'
import { FormInput } from './common/FormInput'

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
        <FormLayout
            title="Registro en FarmaHelper"
            subtitle="Ingrese sus datos para crear una cuenta"
            icon={<Pill className="h-6 w-6 text-primary" />}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="DNI"
                    id="dni"
                    name="dni"
                    type="text"
                    placeholder="Ingrese su DNI"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ingrese su email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Contraseña"
                    id="contraseña"
                    name="contraseña"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={formData.contraseña}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Nombre"
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Ingrese su nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Apellido"
                    id="apellido"
                    name="apellido"
                    type="text"
                    placeholder="Ingrese su apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Teléfono"
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="Ingrese su teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                </Button>
            </form>
        </FormLayout>
    )
}

