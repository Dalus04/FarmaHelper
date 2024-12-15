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

interface UserDto {
    id: number;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    telefono?: string;
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
        const response = await fetch(`${BACKEND_SERVER}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
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
