import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'
import { createDoctorInfo } from '@/api/doctor'
import { FormLayout } from './common/FormLayout'
import { FormInput } from './common/FormInput'

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
        <FormLayout title="Completa tu información">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Especialidad"
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </form>
        </FormLayout>
    )
}

