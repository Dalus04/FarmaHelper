import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { createDoctorInfo } from '../api/auth'

interface DoctorSpecialtyFormProps {
    token: string;
    onSubmitSuccess: () => void;
}

export function DoctorSpecialtyForm({ token, onSubmitSuccess }: DoctorSpecialtyFormProps) {
    const [specialty, setSpecialty] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await createDoctorInfo(token, specialty)
            toast({
                title: "Información guardada",
                description: "Tu especialidad ha sido registrada exitosamente.",
            })
            onSubmitSuccess()
        } catch (error) {
            console.error('Error saving doctor specialty:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Ocurrió un error desconocido",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Completa tu información</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="specialty">Especialidad</Label>
                        <Input
                            id="specialty"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            required
                            className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

