import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: 'Juan', description: 'Nombre del usuario', required: false })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ example: 'Perez', description: 'Apellido del usuario', required: false })
    @IsString()
    @IsOptional()
    apellido?: string;

    @ApiProperty({ example: 'juan.perez@clinica.com', description: 'Correo electrónico del usuario', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: '123456789', description: 'Teléfono del usuario', required: false })
    @IsString()
    @IsOptional()
    telefono?: string;
}
