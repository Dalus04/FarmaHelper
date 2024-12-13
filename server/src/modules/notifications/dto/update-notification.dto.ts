import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { EstadoNotificacion } from "@prisma/client";

export class UpdateNotificationDto {
    @ApiProperty({ example: 'leida', description: 'Nuevo estado de la notificación' })
    @IsEnum(EstadoNotificacion)
    estado: EstadoNotificacion;
}
