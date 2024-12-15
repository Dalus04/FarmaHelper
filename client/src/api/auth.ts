import { BACKEND_SERVER } from "@/config/api";

interface LoginResponse {
    access_token: string;
    user: {
        id: number;
        dni: string;
        rol: string;
        nombre: string;
        apellido: string;
    };
}

interface RegisterUserDto {
    dni: string;
    email: string;
    contraseña: string;
    nombre: string;
    apellido: string;
    telefono: string;
}

export interface CreateUserDto {
    dni: string;
    email: string;
    contraseña: string;
    nombre: string;
    apellido: string;
    rol: string;
    telefono: string;
}

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

export interface UpdateDoctorDto {
    especialidad: string;
}

export interface UpdatePatientDto {
    fechaNacimiento: string;
}

export async function registerUser(userData: RegisterUserDto): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
    }

    return response.json();
}

export async function loginUser(dni: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${BACKEND_SERVER}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión');
    }

    const loginData = await response.json();

    const userResponse = await fetch(`${BACKEND_SERVER}/users/${loginData.user.id}`, {
        headers: {
            'Authorization': `Bearer ${loginData.access_token}`
        }
    });

    if (!userResponse.ok) {
        throw new Error('Error al obtener los detalles del usuario');
    }

    const userData = await userResponse.json();

    return {
        ...loginData,
        user: {
            ...loginData.user,
            ...userData
        }
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

export async function registerSpecialUser(userData: CreateUserDto, token: string): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/users/register-special`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro de usuario especial');
    }

    return response.json();
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

export async function fetchRegisteredPharmacists(token: string): Promise<number[]> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/pharmacist`, {
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

export async function registerPharmacist(token: string, userId: number): Promise<void> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/pharmacist/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario: userId })
        });
        if (!response.ok) {
            throw new Error('Failed to register pharmacist');
        }
    } catch (error) {
        console.error('Error registering pharmacist:', error);
        throw error;
    }
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

export interface UpdateUserDto {
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
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

export async function updateDoctor(token: string, doctorId: number, updateDoctorDto: { especialidad: string }): Promise<any> {
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

export async function updatePatient(token: string, patientId: number, updatePatientDto: { fechaNacimiento: string }): Promise<any> {
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

export async function unassignPharmacist(token: string, pharmacistId: number): Promise<void> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/pharmacist/${pharmacistId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to unassign pharmacist');
        }
    } catch (error) {
        console.error('Error unassigning pharmacist:', error);
        throw error;
    }
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

export interface UpdateMyUserDto {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
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