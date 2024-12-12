import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateDoctorDto {
    @ApiProperty({ example: 1, description: 'ID del usuario asociado' })
    @IsInt()
    @IsNotEmpty()
    idUsuario: number;

    @ApiProperty({ example: 'Cardiología', description: 'Especialidad médica' })
    @IsString()
    @IsNotEmpty()
    especialidad: string;
}
