import { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPrescriptions, updatePrescription, Prescription } from '@/api/prescription'
import { getUser, User } from '@/api/user'
import { createNotification } from '@/api/notification'
import { useToast } from '@/hooks/use-toast'

interface EnhancedPrescription extends Prescription {
    medicoDetails?: User;
    pacienteDetails?: User;
}

export function DispensarRecetasSection() {
    const [prescriptions, setPrescriptions] = useState<EnhancedPrescription[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedPrescription, setSelectedPrescription] = useState<EnhancedPrescription | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { toast } = useToast()

    const fetchPrescriptionsAndUsers = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('No se encontró el token de autenticación')
            }
            const prescriptionsData = await getPrescriptions(token)

            const enhancedPrescriptions = await Promise.all(prescriptionsData
                .filter(prescription => prescription.estado === "pendiente")
                .map(async (prescription) => {
                    const medicoDetails = await getUser(token, prescription.medico.idUsuario)
                    const pacienteDetails = await getUser(token, prescription.paciente.idUsuario)
                    return { ...prescription, medicoDetails, pacienteDetails }
                }))

            setPrescriptions(enhancedPrescriptions)
            setIsLoading(false)
        } catch (err) {
            console.error('Error fetching prescriptions and user details:', err)
            setError('Error al cargar las recetas y detalles de usuarios. Por favor, intente de nuevo más tarde.')
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPrescriptionsAndUsers()
    }, [])

    const handleDispensarClick = (prescription: EnhancedPrescription) => {
        setSelectedPrescription(prescription)
        setIsModalOpen(true)
    }

    const handleConfirmDispensation = async () => {
        if (selectedPrescription) {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('No se encontró el token de autenticación')
                }
                await updatePrescription(token, selectedPrescription.id, { estado: "entregada" })

                // Create notification
                await createNotification(token, {
                    idReceta: selectedPrescription.id,
                    idPaciente: selectedPrescription.idPaciente,
                    estado: "enviada"
                })

                toast({
                    title: "Receta dispensada",
                    description: "La receta ha sido marcada como entregada y se ha enviado una notificación al paciente.",
                })
                setIsModalOpen(false)
                fetchPrescriptionsAndUsers() // Refresh the prescriptions list
            } catch (err) {
                console.error('Error updating prescription or creating notification:', err)
                toast({
                    title: "Error",
                    description: "Hubo un problema al dispensar la receta o enviar la notificación. Por favor, intente de nuevo.",
                    variant: "destructive",
                })
            }
        }
    }

    const calculateAge = (birthDate: string) => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDifference = today.getMonth() - birth.getMonth()
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        return age
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-lg font-medium">Cargando recetas...</p>
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Dispensar Recetas</h1>
            <Table>
                <TableCaption>Lista de recetas pendientes</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID de Receta</TableHead>
                        <TableHead>Fecha de Emisión</TableHead>
                        <TableHead>DNI Paciente</TableHead>
                        <TableHead>Nombre Paciente</TableHead>
                        <TableHead>Apellido Paciente</TableHead>
                        <TableHead>DNI Doctor</TableHead>
                        <TableHead>Nombre Doctor</TableHead>
                        <TableHead>Apellido Doctor</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {prescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                            <TableCell>{prescription.id}</TableCell>
                            <TableCell>{new Date(prescription.fechaEmision).toLocaleDateString()}</TableCell>
                            <TableCell>{prescription.pacienteDetails?.dni || 'N/A'}</TableCell>
                            <TableCell>{prescription.pacienteDetails?.nombre || 'N/A'}</TableCell>
                            <TableCell>{prescription.pacienteDetails?.apellido || 'N/A'}</TableCell>
                            <TableCell>{prescription.medicoDetails?.dni || 'N/A'}</TableCell>
                            <TableCell>{prescription.medicoDetails?.nombre || 'N/A'}</TableCell>
                            <TableCell>{prescription.medicoDetails?.apellido || 'N/A'}</TableCell>
                            <TableCell>{prescription.estado}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleDispensarClick(prescription)}>Dispensar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Detalles de la Receta</DialogTitle>
                    </DialogHeader>
                    {selectedPrescription && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Vista Previa de la Receta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold">Información del Médico</h3>
                                        {selectedPrescription.medicoDetails ? (
                                            <>
                                                <p>Dr. {selectedPrescription.medicoDetails.nombre} {selectedPrescription.medicoDetails.apellido}</p>
                                                <p>{selectedPrescription.medico.especialidad}</p>
                                                <p>DNI: {selectedPrescription.medicoDetails.dni}</p>
                                            </>
                                        ) : (
                                            <p>Cargando información del médico...</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Información del Paciente</h3>
                                        {selectedPrescription.pacienteDetails ? (
                                            <>
                                                <p>Nombre: {selectedPrescription.pacienteDetails.nombre} {selectedPrescription.pacienteDetails.apellido}</p>
                                                <p>DNI: {selectedPrescription.pacienteDetails.dni}</p>
                                                <p>Edad: {calculateAge(selectedPrescription.paciente.fechaNacimiento)} años</p>
                                            </>
                                        ) : (
                                            <p>No se ha seleccionado un paciente</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Medicamentos</h3>
                                        {selectedPrescription.detalles.length > 0 ? (
                                            <ul className="list-disc pl-5">
                                                {selectedPrescription.detalles.map((detalle) => (
                                                    <li key={detalle.id}>
                                                        {detalle.medicamento.nombre} -
                                                        Dosis: {detalle.dosis},
                                                        Frecuencia: {detalle.frecuencia},
                                                        Duración: {detalle.duracion},
                                                        Cantidad: {detalle.cantidad}
                                                        {` (Stock disponible: ${detalle.medicamento.stock})`}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No se han agregado medicamentos</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Instrucciones Adicionales</h3>
                                        <p>{selectedPrescription.comentarios || 'No se han proporcionado instrucciones adicionales'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleConfirmDispensation}>Confirmar Dispensación</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

