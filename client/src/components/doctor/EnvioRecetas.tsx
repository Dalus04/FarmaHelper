import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Search } from 'lucide-react'
import { fetchPatients, Patient } from '@/api/patient'
import { fetchDoctorInfo, Doctor } from '@/api/doctor'
import { fetchMedications, Medication } from '@/api/medicines'
import { createPrescription, CreatePrescriptionDto } from '@/api/prescription'
import { useToast } from '@/hooks/use-toast'

interface PrescriptionMedication {
    id: string;
    medicationId: string;
    dose: string;
    frequency: string;
    duration: string;
    quantity: number;
}

export function EnvioRecetasSection() {
    const { toast } = useToast()
    const navigate = useNavigate()
    const [patientId, setPatientId] = useState('')
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [patients, setPatients] = useState<Patient[]>([])
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [prescriptionMedications, setPrescriptionMedications] = useState<PrescriptionMedication[]>([])
    const [medications, setMedications] = useState<Medication[]>([])
    const [instructions, setInstructions] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [doctor, setDoctor] = useState<Doctor | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function loadData() {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('No se encontró el token de autenticación')
                }
                const [fetchedPatients, fetchedDoctor, fetchedMedications] = await Promise.all([
                    fetchPatients(token),
                    fetchDoctorInfo(token),
                    fetchMedications(token)
                ])
                setPatients(fetchedPatients)
                setFilteredPatients(fetchedPatients)
                setDoctor(fetchedDoctor)
                setMedications(fetchedMedications)
                setIsLoading(false)
            } catch (err) {
                setError('Error al cargar los datos. Por favor, intente de nuevo.')
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    useEffect(() => {
        const filtered = patients.filter(patient =>
            patient.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.usuario.dni.includes(searchTerm)
        )
        setFilteredPatients(filtered)
    }, [searchTerm, patients])

    useEffect(() => {
        const patient = patients.find(p => p.id.toString() === patientId)
        setSelectedPatient(patient || null)
    }, [patientId, patients])

    const addMedication = () => {
        setPrescriptionMedications([...prescriptionMedications, {
            id: Date.now().toString(),
            medicationId: '',
            dose: '',
            frequency: '',
            duration: '',
            quantity: 0
        }])
    }

    const removeMedication = (id: string) => {
        setPrescriptionMedications(prescriptionMedications.filter(med => med.id !== id))
    }

    const updateMedication = (id: string, field: keyof PrescriptionMedication, value: string | number) => {
        setPrescriptionMedications(prescriptionMedications.map(med =>
            med.id === id ? { ...med, [field]: value } : med
        ))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (!doctor || !selectedPatient) {
            toast({
                title: "Error",
                description: "Falta información del médico o paciente",
                variant: "destructive",
            })
            setIsSubmitting(false)
            return
        }

        const prescriptionData: CreatePrescriptionDto = {
            idMedico: doctor.id,
            idPaciente: selectedPatient.id,
            comentarios: instructions,
            detalles: prescriptionMedications.map(med => ({
                dosis: med.dose,
                frecuencia: med.frequency,
                duracion: med.duration,
                cantidad: med.quantity,
                idMedicamento: parseInt(med.medicationId)
            }))
        }

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('No se encontró el token de autenticación')
            }
            await createPrescription(token, prescriptionData)
            toast({
                title: "Éxito",
                description: "La receta se ha creado correctamente",
            })
            navigate('/dashboard/medico')
        } catch (error) {
            toast({
                title: "Error",
                description: "Hubo un problema al crear la receta. Por favor, intente de nuevo.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
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
        return <div>Cargando datos...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Envío de Recetas</h2>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="patient-search">Buscar Paciente</Label>
                            <div className="relative">
                                <Input
                                    id="patient-search"
                                    type="text"
                                    placeholder="Buscar por nombre o DNI"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="patient">Seleccionar Paciente</Label>
                            <Select onValueChange={setPatientId} value={patientId}>
                                <SelectTrigger id="patient">
                                    <SelectValue placeholder="Seleccione un paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredPatients.map(patient => (
                                        <SelectItem key={patient.id} value={patient.id.toString()}>
                                            {`${patient.usuario.nombre} ${patient.usuario.apellido} - DNI: ${patient.usuario.dni}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Medicamentos</Label>
                            {prescriptionMedications.map((med, index) => (
                                <div key={med.id} className="flex flex-wrap gap-2 items-end mb-4 p-4 border rounded">
                                    <div className="flex-1 min-w-[200px]">
                                        <Label htmlFor={`medication-${med.id}`}>Medicamento</Label>
                                        <Select onValueChange={(value) => updateMedication(med.id, 'medicationId', value)} value={med.medicationId}>
                                            <SelectTrigger id={`medication-${med.id}`}>
                                                <SelectValue placeholder="Seleccione un medicamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {medications.map(medication => (
                                                    <SelectItem key={medication.id} value={medication.id.toString()} disabled={medication.stock === 0}>
                                                        {medication.nombre} (Stock: {medication.stock})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <Label htmlFor={`dose-${med.id}`}>Dosis</Label>
                                        <Input
                                            id={`dose-${med.id}`}
                                            value={med.dose}
                                            onChange={(e) => updateMedication(med.id, 'dose', e.target.value)}
                                            placeholder="Ej: 500mg"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <Label htmlFor={`frequency-${med.id}`}>Frecuencia</Label>
                                        <Input
                                            id={`frequency-${med.id}`}
                                            value={med.frequency}
                                            onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                                            placeholder="Ej: Cada 8 horas"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[150px]">
                                        <Label htmlFor={`duration-${med.id}`}>Duración</Label>
                                        <Input
                                            id={`duration-${med.id}`}
                                            value={med.duration}
                                            onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                                            placeholder="Ej: 7 días"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[100px]">
                                        <Label htmlFor={`quantity-${med.id}`}>Cantidad</Label>
                                        <Input
                                            id={`quantity-${med.id}`}
                                            type="number"
                                            value={med.quantity}
                                            onChange={(e) => updateMedication(med.id, 'quantity', parseInt(e.target.value))}
                                            min="1"
                                            max={medications.find(m => m.id.toString() === med.medicationId)?.stock || 1}
                                        />
                                    </div>
                                    <Button type="button" variant="destructive" onClick={() => removeMedication(med.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" onClick={addMedication} className="mt-2">
                                <Plus className="h-4 w-4 mr-2" /> Agregar Medicamento
                            </Button>
                        </div>

                        <div>
                            <Label htmlFor="instructions">Instrucciones Adicionales</Label>
                            <Textarea
                                id="instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Ingrese instrucciones adicionales aquí"
                                className="h-32"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => navigate('/dashboard/medico')}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creando...' : 'Crear Receta'}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="w-full lg:w-1/2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vista Previa de la Receta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold">Información del Médico</h3>
                                    {doctor ? (
                                        <>
                                            <p>Dr. {doctor.usuario.nombre} {doctor.usuario.apellido}</p>
                                            <p>{doctor.especialidad}</p>
                                            <p>DNI: {doctor.usuario.dni}</p>
                                        </>
                                    ) : (
                                        <p>Cargando información del médico...</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold">Información del Paciente</h3>
                                    {selectedPatient ? (
                                        <>
                                            <p>Nombre: {selectedPatient.usuario.nombre} {selectedPatient.usuario.apellido}</p>
                                            <p>DNI: {selectedPatient.usuario.dni}</p>
                                            <p>Edad: {calculateAge(selectedPatient.fechaNacimiento)} años</p>
                                        </>
                                    ) : (
                                        <p>No se ha seleccionado un paciente</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold">Medicamentos</h3>
                                    {prescriptionMedications.length > 0 ? (
                                        <ul className="list-disc pl-5">
                                            {prescriptionMedications.map((med, index) => {
                                                const medication = medications.find(m => m.id.toString() === med.medicationId);
                                                return (
                                                    <li key={med.id}>
                                                        {medication ? medication.nombre : 'Medicamento no seleccionado'} -
                                                        Dosis: {med.dose || 'No especificada'},
                                                        Frecuencia: {med.frequency || 'No especificada'},
                                                        Duración: {med.duration || 'No especificada'},
                                                        Cantidad: {med.quantity || 'No especificada'}
                                                        {medication && ` (Stock disponible: ${medication.stock})`}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p>No se han agregado medicamentos</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold">Instrucciones Adicionales</h3>
                                    <p>{instructions || 'No se han proporcionado instrucciones adicionales'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

