import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    const { idMedico, idPaciente, comentarios, detalles } = createPrescriptionDto;

    return this.prisma.receta.create({
      data: {
        idMedico,
        idPaciente,
        comentarios,
        detalles: {
          create: detalles.map(detalle => ({
            dosis: detalle.dosis,
            frecuencia: detalle.frecuencia,
            duracion: detalle.duracion,
            cantidad: detalle.cantidad,
            idMedicamento: detalle.idMedicamento,
          })),
        },
      },
      include: {
        detalles: {
          include: {
            medicamento: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.receta.findMany({
      include: {
        medico: true,
        paciente: true,
        detalles: {
          include: { medicamento: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const prescription = await this.prisma.receta.findUnique({
      where: { id },
      include: {
        medico: true,
        paciente: true,
        detalles: {
          include: { medicamento: true },
        },
      },
    });

    if (!prescription) {
      throw new NotFoundException('Receta no encontrada');
    }

    return prescription;
  }

  async update(id: number, updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prisma.receta.update({
      where: { id },
      data: updatePrescriptionDto,
    });
  }

  async remove(id: number) {
    return this.prisma.receta.delete({
      where: { id },
    });
  }
}
