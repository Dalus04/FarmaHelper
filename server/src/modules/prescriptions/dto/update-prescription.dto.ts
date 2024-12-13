import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional } from "class-validator";
import { Estado } from "@prisma/client";

export class UpdatePrescriptionDto {
    @ApiProperty({ example: 'entregada', description: 'Estado de la receta', required: false })
    @IsEnum(Estado)
    @IsOptional()
    estado?: Estado;

    @ApiProperty({ example: 'Tomar después de las comidas', description: 'Comentarios adicionales', required: false })
    @IsString()
    @IsOptional()
    comentarios?: string;
}
