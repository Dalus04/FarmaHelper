import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import { deleteAccount } from '@/api/auth'

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeleteSuccess: () => void;
}

export function DeleteAccountModal({ isOpen, onClose, onDeleteSuccess }: DeleteAccountModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleConfirmDelete = async () => {
        setIsLoading(true)

        try {
            await deleteAccount(localStorage.getItem('token') || '')
            toast({
                title: "Éxito",
                description: "Tu cuenta ha sido eliminada correctamente.",
            })
            onDeleteSuccess()
        } catch (error) {
            console.error('Error deleting account:', error)
            toast({
                title: "Error",
                description: "No se pudo eliminar la cuenta. Por favor, inténtalo de nuevo.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar eliminación de cuenta</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleConfirmDelete} disabled={isLoading}>
                        {isLoading ? "Eliminando..." : "Eliminar cuenta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

