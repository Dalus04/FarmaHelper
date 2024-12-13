import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill } from 'lucide-react'
import { loginUser } from '../api/auth'
import { useToast } from '@/hooks/use-toast'

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [dni, setDni] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await loginUser(dni, password)
            console.log('Login successful:', response)
            toast({
                title: "Inicio de sesión exitoso",
                description: `Bienvenido, ${response.user.dni}`,
            })
            onLoginSuccess()
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
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                    <Pill className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-bold text-center">FarmaHelper</CardTitle>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                    Ingrese sus credenciales para acceder al sistema
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                            id="dni"
                            type="text"
                            placeholder="Ingrese su DNI"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

