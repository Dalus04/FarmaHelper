import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PrescriptionsDetails {
    @ApiProperty({ example: '500mg', description: 'Dosis del medicamento' })
    @IsString()
    dosis: string;

    @ApiProperty({ example: 'Cada 8 horas', description: 'Frecuencia de administración' })
    @IsString()
    frecuencia: string;

    @ApiProperty({ example: '7 días', description: 'Duración del tratamiento' })
    @IsString()
    duracion: string;

    @ApiProperty({ example: 2, description: 'Cantidad del medicamento' })
    @IsInt()
    cantidad: number;

    @ApiProperty({ example: 1, description: 'ID del medicamento' })
    @IsInt()
    idMedicamento: number;
}

export class CreatePrescriptionDto {
    @ApiProperty({ example: 1, description: 'ID del médico que emite la receta' })
    @IsInt()
    idMedico: number;

    @ApiProperty({ example: 2, description: 'ID del paciente que recibe la receta' })
    @IsInt()
    idPaciente: number;

    @ApiProperty({ example: 'Tomar con abundante agua', description: 'Comentarios adicionales', required: false })
    @IsString()
    @IsOptional()
    comentarios?: string;

    @ApiProperty({ type: [PrescriptionsDetails], description: 'Lista de detalles de los medicamentos' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PrescriptionsDetails)
    detalles: PrescriptionsDetails[];
}
