import { BACKEND_SERVER } from "@/config/api";

export interface UpdatePatientDto {
    fechaNacimiento: string;
}

export interface Patient {
    id: number;
    fechaNacimiento: string;
    idUsuario: number;
    usuario: {
        id: number;
        nombre: string;
        apellido: string;
        dni: string;
        email: string;
        rol: string;
        telefono: string;
    };
}

export async function createPatientInfo(token: string, fechaNacimiento: string): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/patients/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fechaNacimiento }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la información del paciente');
    }

    return response.json();
}

export async function updatePatient(token: string, patientId: number, updatePatientDto: UpdatePatientDto): Promise<any> {
    const formattedDate = `${updatePatientDto.fechaNacimiento}T00:00:00Z`;
    const response = await fetch(`${BACKEND_SERVER}/patients/update/${patientId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fechaNacimiento: formattedDate })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el paciente');
    }

    return response.json();
}

export async function updatePatientInfo(token: string, updatePatientDto: UpdatePatientDto): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/patients/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePatientDto)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la información del paciente');
    }

    return response.json();
}

export async function fetchPatients(token: string): Promise<Patient[]> {
    const response = await fetch(`${BACKEND_SERVER}/patients`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los pacientes');
    }

    return response.json();
}
