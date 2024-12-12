import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class CreatePatientDto {
    @ApiProperty({
        example: '1995-08-15T00:00:00Z',
        description: 'Fecha de nacimiento del paciente en formato ISO 8601 con hora (opcional)'
    }) 
    @IsDateString()
    @IsOptional()
    fechaNacimiento?: string;
}
