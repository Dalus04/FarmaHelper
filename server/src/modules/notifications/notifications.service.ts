import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const { idReceta, idPaciente, estado } = createNotificationDto;

    return this.prisma.notificacion.create({
      data: {
        idReceta,
        idPaciente,
        estado,
      },
    });
  }

  async findAllByPatient(idPaciente: number) {
    return this.prisma.notificacion.findMany({
      where: { idPaciente },
      include: { receta: true },
    })
  }

  async findOne(id: number) {
    const notification = await this.prisma.notificacion.findUnique({
      where: { id },
      include: { receta: true },
    });

    if (!notification) {
      throw new NotFoundException('Notificacion no encontrada');
    }

    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.prisma.notificacion.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificacion no encontrada');
    }

    return this.prisma.notificacion.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  async remove(id: number) {
    const notification = await this.prisma.notificacion.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    return this.prisma.notificacion.delete({
      where: { id },
    });
  }
}
