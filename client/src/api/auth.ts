import { BACKEND_SERVER } from "@/config/api";

interface LoginResponse {
    access_token: string;
    user: {
        id: number;
        dni: string;
        rol: string;
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

    return response.json();
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

