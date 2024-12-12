import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional } from "class-validator";

enum Rol {
    medico = 'medico',
    farmaceutico = 'farmaceutico',
    paciente = 'paciente',
    admin = 'admin',
}

export class CreateUserDto {
    @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: 'Perez', description: 'Apellido del usuario' })
    @IsString()
    @IsNotEmpty()
    apellido: string;

    @ApiProperty({ example: '12345678', description: 'DNI del usuario' })
    @IsString()
    @IsNotEmpty()
    dni: string;

    @ApiProperty({ example: 'juan.perez@clinica.com', description: 'Correo electrónico del usuario' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
    @IsString()
    @IsNotEmpty()
    contraseña: string;

    @ApiProperty({ example: 'medico', enum: Rol, description: 'Rol del usuario' })
    @IsEnum(Rol)
    @IsNotEmpty()
    rol: Rol;

    @ApiProperty({ example: '123456789', description: 'Teléfono del usuario', required: false })
    @IsString()
    @IsOptional()
    telefono?: string;
}
