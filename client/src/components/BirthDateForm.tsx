import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { createPatientInfo } from '@/api/patient'
import { useToast } from '@/hooks/use-toast'
import { FormLayout } from './common/FormLayout'
import { FormInput } from './common/FormInput'

interface BirthDateFormProps {
    token: string;
    onSubmitSuccess: () => void;
}

export function BirthDateForm({ token, onSubmitSuccess }: BirthDateFormProps) {
    const [birthDate, setBirthDate] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formattedDate = new Date(birthDate).toISOString();
            await createPatientInfo(token, formattedDate)
            toast({
                title: "Información guardada",
                description: "Tu fecha de nacimiento ha sido registrada exitosamente.",
            })
            onSubmitSuccess()
        } catch (error) {
            console.error('Error saving birth date:', error)
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
                    label="Fecha de Nacimiento"
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
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

