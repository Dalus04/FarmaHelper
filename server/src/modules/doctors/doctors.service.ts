import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDoctorDto: CreateDoctorDto) {
    const { idUsuario, especialidad } = createDoctorDto;

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    if (!usuario || usuario.rol != 'medico') {
      throw new NotFoundException('El usuario no existe o no es un médico')
    }

    return this.prisma.medico.create({
      data: {
        idUsuario,
        especialidad,
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

  /*
  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }*/
}
