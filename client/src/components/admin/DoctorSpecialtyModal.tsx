import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DoctorSpecialtyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (specialty: string) => void;
    userName: string;
}

export function DoctorSpecialtyModal({ isOpen, onClose, onSubmit, userName }: DoctorSpecialtyModalProps) {
    const [specialty, setSpecialty] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(specialty)
        setSpecialty('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ingresar Especialidad del Médico</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <p>Registrando a {userName} como médico</p>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="specialty" className="text-right">
                                Especialidad
                            </Label>
                            <Input
                                id="specialty"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

