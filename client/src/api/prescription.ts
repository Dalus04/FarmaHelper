import { BACKEND_SERVER } from "@/config/api";

export interface CreatePrescriptionDto {
    idMedico: number;
    idPaciente: number;
    comentarios: string;
    detalles: {
        dosis: string;
        frecuencia: string;
        duracion: string;
        cantidad: number;
        idMedicamento: number;
    }[];
}

export async function createPrescription(token: string, createPrescriptionDto: CreatePrescriptionDto): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/prescriptions/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createPrescriptionDto)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la receta');
    }

    return response.json();
}