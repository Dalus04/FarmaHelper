import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CreatePharmacistDto {
    @ApiProperty({ example: 1, description: 'ID del usuario asociado al farmacéutico' })
    @IsInt()
    idUsuario: number;
}
