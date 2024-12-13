import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsEnum } from "class-validator";
import { EstadoNotificacion } from "@prisma/client";

export class CreateNotificationDto {
    @ApiProperty({ example: 1, description: 'ID de la receta asociada a la notificación' })
    @IsInt()
    idReceta: number;

    @ApiProperty({ example: 2, description: 'ID del paciente asociado a la notificación' })
    @IsInt()
    idPaciente: number;

    @ApiProperty({ example: 'enviada', description: 'Estado inicial de la notificación' })
    @IsEnum(EstadoNotificacion)
    estado: EstadoNotificacion;
}
