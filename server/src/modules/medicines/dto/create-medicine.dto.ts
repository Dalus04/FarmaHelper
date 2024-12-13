import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, Min } from "class-validator";

export class CreateMedicineDto {
    @ApiProperty({ example: 'Paracetamol', description: 'Nombre del medicamento' })
    @IsString()
    nombre: string;

    @ApiProperty({ example: 100, description: 'Cantidad en stock del medicamento' })
    @IsInt()
    @Min(0)
    stock: number;
}
