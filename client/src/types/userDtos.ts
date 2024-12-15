export interface UserDto {
    id: number;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    telefono?: string;
}

export interface CreateUserDto {
    dni: string;
    email: string;
    contraseña: string;
    nombre: string;
    apellido: string;
    rol: string;
    telefono?: string;
}

export interface LoginResponse {
    access_token: string;
    user: UserDto;
}

