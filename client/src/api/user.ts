import { BACKEND_SERVER } from "@/config/api";

export interface UserDto {
    id: number;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    telefono?: string;
    idEspecifico?: number;
    especialidad?: string;
    fechaNacimiento?: string;
    canAssign?: boolean;
    canUnassign?: boolean;
}

export interface UpdateUserDto {
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
}

export interface UpdateMyUserDto {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
}

interface Doctor {
    idUsuario: number;
    id: number;
    especialidad: string;
}

interface Pharmacist {
    idUsuario: number;
    id: number;
}

interface Patient {
    idUsuario: number;
    id: number;
    fechaNacimiento: string;
}


export async function fetchUsers(token: string): Promise<UserDto[]> {
    try {
        const [users, doctors, pharmacists, patients] = await Promise.all([
            fetch(`${BACKEND_SERVER}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json() as Promise<UserDto[]>),

            fetch(`${BACKEND_SERVER}/doctors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json() as Promise<Doctor[]>),

            fetch(`${BACKEND_SERVER}/pharmacist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json() as Promise<Pharmacist[]>),

            fetch(`${BACKEND_SERVER}/patients`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json() as Promise<Patient[]>)
        ]);

        const doctorMap = new Map(doctors.map((d) => [d.idUsuario, d]));
        const pharmacistMap = new Map(pharmacists.map((p) => [p.idUsuario, p]));
        const patientMap = new Map(patients.map((p) => [p.idUsuario, p]));

        return users.map((user) => {
            let idEspecifico: number | undefined;
            let especialidad: string | undefined;
            let fechaNacimiento: string | undefined;

            if (user.rol === 'medico') {
                const doctor = doctorMap.get(user.id);
                if (doctor) {
                    idEspecifico = doctor.id;
                    especialidad = doctor.especialidad;
                }
            } else if (user.rol === 'farmaceutico') {
                const pharmacist = pharmacistMap.get(user.id);
                if (pharmacist) {
                    idEspecifico = pharmacist.id;
                }
            } else if (user.rol === 'paciente') {
                const patient = patientMap.get(user.id);
                if (patient) {
                    idEspecifico = patient.id;
                    fechaNacimiento = patient.fechaNacimiento;
                }
            }

            return { ...user, idEspecifico, especialidad, fechaNacimiento };
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function updateUser(token: string, userId: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const response = await fetch(`${BACKEND_SERVER}/users/update/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateUserDto)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el usuario');
    }

    return response.json();
}

export async function deleteUser(token: string, userId: number): Promise<void> {
    const response = await fetch(`${BACKEND_SERVER}/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el usuario');
    }
}

export async function updateUserInfo(token: string, userData: UpdateMyUserDto): Promise<UpdateMyUserDto> {
    const response = await fetch(`${BACKEND_SERVER}/users/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user information');
    }

    return response.json();
}

export async function deleteAccount(token: string): Promise<void> {
    const response = await fetch(`${BACKEND_SERVER}/users/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmation: true }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
    }
}

