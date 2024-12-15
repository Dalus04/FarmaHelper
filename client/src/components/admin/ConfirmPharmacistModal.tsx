import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmPharmacistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
}

export function ConfirmPharmacistModal({ isOpen, onClose, onConfirm, userName }: ConfirmPharmacistModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Registro de Farmacéutico</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>¿Está seguro que desea registrar a {userName} como farmacéutico?</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={onConfirm}>Confirmar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

