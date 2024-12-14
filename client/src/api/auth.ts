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
