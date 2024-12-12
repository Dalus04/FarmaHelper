import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateDoctorDto {
    @ApiProperty({ example: 'Cardiología', description: 'Especialidad del médico' })
    @IsString()
    @IsOptional()
    especialidad?: string;
}
