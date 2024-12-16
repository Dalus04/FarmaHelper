import { BACKEND_SERVER } from "@/config/api";

export interface UpdateDoctorDto {
    especialidad: string;
}

export async function fetchRegisteredDoctors(token: string): Promise<number[]> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/doctors`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch registered doctors');
        }
        const doctors = await response.json();
        return doctors.map((doctor: any) => doctor.usuario.id);
    } catch (error) {
        console.error('Error fetching registered doctors:', error);
        throw error;
    }
}

export async function registerDoctor(token: string, userId: number, specialty: string): Promise<void> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/doctors/create/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ especialidad: specialty })
        });
        if (!response.ok) {
            throw new Error('Failed to register doctor');
        }
    } catch (error) {
        console.error('Error registering doctor:', error);
        throw error;
    }
}

export async function updateDoctor(token: string, doctorId: number, updateDoctorDto: UpdateDoctorDto): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/doctors/update/${doctorId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateDoctorDto)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el médico');
    }

    return response.json();
}

export async function unassignDoctor(token: string, doctorId: number): Promise<void> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/doctors/${doctorId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to unassign doctor');
        }
    } catch (error) {
        console.error('Error unassigning doctor:', error);
        throw error;
    }
}

export async function createDoctorInfo(token: string, especialidad: string): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/doctors/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ especialidad }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la información del médico');
    }

    return response.json();
}

export async function updateDoctorInfo(token: string, updateDoctorDto: UpdateDoctorDto): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/doctors/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateDoctorDto)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la información del médico');
    }

    return response.json();
}

