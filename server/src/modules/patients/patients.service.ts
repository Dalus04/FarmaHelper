import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(idUsuario: number, createPatientDto: CreatePatientDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.rol !== 'paciente') {
      throw new ConflictException('El usuario no tiene el rol de paciente');
    }

    const existingPatient = await this.prisma.paciente.findUnique({
      where: { idUsuario },
    });

    if (existingPatient) {
      throw new ConflictException('La informacion del paciente ya existe');
    }

    return this.prisma.paciente.create({
      data: {
        idUsuario,
        fechaNacimiento: createPatientDto.fechaNacimiento,
      },
    });
  }

  async findAll() {
    return this.prisma.paciente.findMany({
      include: { usuario: true },
    });
  }

  async findOne(id: number) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return paciente;
  }

  async updateOwnInfo(idUsuario: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.prisma.paciente.findUnique({
      where: { idUsuario },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.prisma.paciente.update({
      where: { idUsuario },
      data: updatePatientDto,
    });
  }

  async updateByAdmin(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.prisma.paciente.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.prisma.paciente.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  async remove(id: number) {
    const patient = await this.prisma.paciente.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.prisma.paciente.delete({
      where: { id },
    });

  }

}