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

export interface Prescription {
    id: number;
    fechaEmision: string;
    estado: string;
    comentarios: string;
    idMedico: number;
    idPaciente: number;
    medico: {
        id: number;
        especialidad: string;
        idUsuario: number;
        dni?: string;
        nombre?: string;
        apellido?: string;
    };
    paciente: {
        id: number;
        fechaNacimiento: string;
        idUsuario: number;
        dni?: string;
        nombre?: string;
        apellido?: string;
    };
    detalles: Array<{
        id: number;
        dosis: string;
        frecuencia: string;
        duracion: string;
        cantidad: number;
        idReceta: number;
        idMedicamento: number;
        medicamento: {
            id: number;
            nombre: string;
            stock: number;
        };
    }>;
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

export async function getPrescriptions(token: string): Promise<Prescription[]> {
    const response = await fetch(`${BACKEND_SERVER}/prescriptions`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener las recetas');
    }

    return response.json();
}

export interface UpdatePrescriptionDto {
    estado?: string;
    comentarios?: string;
}

export async function updatePrescription(token: string, id: number, updatePrescriptionDto: UpdatePrescriptionDto): Promise<Prescription> {
    const response = await fetch(`${BACKEND_SERVER}/prescriptions/update/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePrescriptionDto)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la receta');
    }

    return response.json();
}
