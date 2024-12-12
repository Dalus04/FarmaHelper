import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePharmacistDto } from './dto/create-pharmacist.dto';
import { UpdatePharmacistDto } from './dto/update-pharmacist.dto';

@Injectable()
export class PharmacistService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPharmacistDto: CreatePharmacistDto) {
    const existingPharmacist = await this.prisma.farmaceutico.findUnique({
      where: { idUsuario: createPharmacistDto.idUsuario },
    });

    if (existingPharmacist) {
      throw new ConflictException('Este usuario ya es un farmacéutico');
    }

    const user = await this.prisma.usuario.findUnique({
      where: { id: createPharmacistDto.idUsuario },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.rol !== 'farmaceutico') {
      throw new ConflictException('El usuario no tiene el rol de farmacéutico');
    }

    return this.prisma.farmaceutico.create({
      data: {
        idUsuario: createPharmacistDto.idUsuario,
      },
    });
  }

  async findAll() {
    return this.prisma.farmaceutico.findMany({
      include: { usuario: true },
    });
  }

  async findOne(id: number) {
    const pharmacist = await this.prisma.farmaceutico.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!pharmacist) {
      throw new NotFoundException('Farmacéutico no encontrado');
    }

    return pharmacist;
  }

  /*update(id: number, updatePharmacistDto: UpdatePharmacistDto) {
    return `This action updates a #${id} pharmacist`;
  }*/

  async remove(id: number) {
    const pharmacist = await this.prisma.farmaceutico.findUnique({
      where: { id },
    });

    if (!pharmacist) {
      throw new NotFoundException('Farmacéutico no encontrado');
    }

    return this.prisma.farmaceutico.delete({
      where: { id },
    });
  }
}
