import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum Rol {
    paciente = 'paciente',
    medico = 'medico',
    farmaceutico = 'farmaceutico',
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

    @ApiProperty({ example: 'paciente', enum: Rol, description: 'Rol del usuario', required: false })
    @IsEnum(Rol)
    @IsOptional()
    rol?: Rol;

    @ApiProperty({ example: '123456789', description: 'Teléfono del usuario', required: false })
    @IsString()
    @IsOptional()
    telefono?: string;
}