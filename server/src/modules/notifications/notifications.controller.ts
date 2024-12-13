import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @Post('create')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @ApiOperation({ summary: 'Obtener todas las notificaciones de un paciente' })
  @Get('paciente/:id')
  findAll(@Param('id') idPaciente: number) {
    return this.notificationsService.findAllByPatient(+idPaciente);
  }

  @ApiOperation({ summary: 'Obtener una notificación por su ID' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notificationsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar el estado de la notificación' })
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @ApiOperation({ summary: 'Eliminar una notificación' })
  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.notificationsService.remove(+id);
  }
}
