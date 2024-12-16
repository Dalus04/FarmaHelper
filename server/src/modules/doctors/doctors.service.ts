import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(idUsuario: number, createDoctorDto: CreateDoctorDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.rol !== 'medico') {
      throw new ConflictException('El usuario no tiene el rol de médico');
    }

    const existingDoctor = await this.prisma.medico.findUnique({
      where: { idUsuario },
    });

    if (existingDoctor) {
      throw new ConflictException('La información del médico ya existe')
    }

    return this.prisma.medico.create({
      data: {
        idUsuario,
        especialidad: createDoctorDto.especialidad,
      },
    });
  }

  async findAll() {
    return this.prisma.medico.findMany({
      include: { usuario: true },
    });
  }

  /*async findOne(id: number) {
    const medico = await this.prisma.medico.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    return medico;
  }*/

  async findOwnInfo(idUsuario: number) {
    const doctor = await this.prisma.medico.findUnique({
      where: { idUsuario },
      include: { usuario: true },
    });

    if (!doctor) {
      throw new NotFoundException('Información del médico no encontrada');
    }

    return doctor;
  }

  async updateOwnInfo(idUsuario: number, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.prisma.medico.findUnique({
      where: { idUsuario },
    });

    if (!doctor) {
      throw new NotFoundException('Médico no encontrado');
    }

    return this.prisma.medico.update({
      where: { idUsuario },
      data: updateDoctorDto,
    });
  }

  async updateByAdmin(id: number, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.prisma.medico.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Médico no encontrado');
    }

    return this.prisma.medico.update({
      where: { id },
      data: updateDoctorDto,
    });
  }

  async remove(id: number) {
    const doctor = await this.prisma.medico.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Médico no encontrado');
    }

    return this.prisma.medico.delete({
      where: { id },
    });
  }
}
