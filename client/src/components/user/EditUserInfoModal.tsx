import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'
import { updateUserInfo, UpdateMyUserDto } from '@/api/user'
import { Modal } from '../common/Modal'
import { FormInput } from '../common/FormInput'

interface EditUserInfoModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdateSuccess: (updatedUser: UpdateMyUserDto) => void
    currentUser: {
        nombre: string
        apellido: string
        email: string
        telefono: string
    } | null
}

export function EditUserInfoModal({ isOpen, onClose, onUpdateSuccess, currentUser }: EditUserInfoModalProps) {
    const [formData, setFormData] = useState<UpdateMyUserDto>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        if (currentUser) {
            setFormData(currentUser)
        }
    }, [currentUser])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const updatedUser = await updateUserInfo(localStorage.getItem('token') || '', formData)
            onUpdateSuccess(updatedUser)
            toast({
                title: "Éxito",
                description: "Información de usuario actualizada correctamente.",
            })
            onClose()
        } catch (error) {
            console.error('Error updating user info:', error)
            toast({
                title: "Error",
                description: "No se pudo actualizar la información del usuario.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!currentUser) {
        return null
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar información de usuario"
            footer={
                <Button type="submit" form="edit-user-form" disabled={isLoading}>
                    {isLoading ? "Actualizando..." : "Guardar cambios"}
                </Button>
            }
        >
            <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Nombre"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                />
                <FormInput
                    label="Apellido"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                />
                <FormInput
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <FormInput
                    label="Teléfono"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                />
            </form>
        </Modal>
    )
}

