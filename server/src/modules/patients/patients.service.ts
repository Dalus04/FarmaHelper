import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(idUsuario: number, createPatientDto: CreatePatientDto) {
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

  async updateOwnInfo(idUsuario: number, createPatientDto: CreatePatientDto) {
    const patient = await this.prisma.paciente.findUnique({
      where: { idUsuario },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.prisma.paciente.update({
      where: { idUsuario },
      data: createPatientDto,
    });
  }

  async updateByAdmin(id: number, createPatientDto: CreatePatientDto) {
    const patient = await this.prisma.paciente.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.prisma.paciente.update({
      where: { id },
      data: createPatientDto,
    });
  }

  /*remove(id: number) {
    return `This action removes a #${id} patient`;
  } */
  
}
