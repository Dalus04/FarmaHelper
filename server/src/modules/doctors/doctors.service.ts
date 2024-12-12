import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(idUsuario: number, createDoctorDto: CreateDoctorDto) {
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

  async findOne(id: number) {
    const medico = await this.prisma.medico.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    return medico;
  }


  async updateOwnInfo(idUsuario: number, createDoctorDto: CreateDoctorDto) {
    const doctor = await this.prisma.medico.findUnique({
      where: { idUsuario },
    });

    if (!doctor) {
      throw new NotFoundException('Médico no encontrado');
    }

    return this.prisma.medico.update({
      where: { idUsuario },
      data: createDoctorDto,
    });
  }

  async updateByAdmin(id: number, createDoctorDto: CreateDoctorDto) {
    const doctor = await this.prisma.medico.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Médico no encontrado');
    }

    return this.prisma.medico.update({
      where: { id },
      data: createDoctorDto,
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
