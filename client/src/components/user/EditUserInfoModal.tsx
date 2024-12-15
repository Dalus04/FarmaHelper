import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'
import { updateUserInfo, UpdateMyUserDto } from '@/api/auth'

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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar información de usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="apellido" className="text-right">
                                Apellido
                            </Label>
                            <Input
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="telefono" className="text-right">
                                Teléfono
                            </Label>
                            <Input
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Actualizando..." : "Guardar cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

