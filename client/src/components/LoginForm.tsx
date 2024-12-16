import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Pill } from 'lucide-react'
import { loginUser } from '../api/auth'
import { useToast } from '@/hooks/use-toast'
import { FormLayout } from './common/FormLayout'
import { FormInput } from './common/FormInput'

interface LoginFormProps {
    onLoginSuccess: (name: string, role: string, token: string, user: any) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [dni, setDni] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await loginUser(dni, password)
            console.log('Login successful:', response)
            const fullName = `${response.user.nombre} ${response.user.apellido}`.trim()
            toast({
                title: "Inicio de sesión exitoso",
                description: `Bienvenido, ${fullName}`,
            })
            onLoginSuccess(fullName, response.user.rol, response.access_token, response.user)
            navigate('/dashboard')
        } catch (error) {
            console.error('Login error:', error)
            toast({
                title: "Error de inicio de sesión",
                description: error instanceof Error ? error.message : "Ocurrió un error desconocido",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <FormLayout
            title="FarmaHelper"
            subtitle="Ingrese sus credenciales para acceder al sistema"
            icon={<Pill className="h-6 w-6 text-primary" />}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="DNI"
                    id="dni"
                    type="text"
                    placeholder="Ingrese su DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                />
                <FormInput
                    label="Contraseña"
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
            </form>
            <div className="mt-4 text-center">
                <Link to="/register" className="text-sm text-primary hover:underline">
                    ¿No tienes cuenta? Regístrate
                </Link>
            </div>
        </FormLayout>
    )
}

