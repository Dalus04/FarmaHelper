import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMedicineDto: CreateMedicineDto) {
    return this.prisma.medicamento.create({
      data: createMedicineDto,
    });
  }

  async findAll() {
    return this.prisma.medicamento.findMany();
  }

  async findOne(id: number) {
    const medicine = await this.prisma.medicamento.findUnique({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException('Medicamento no encontrado')
    }

    return medicine;
  }

  async update(id: number, updateMedicineDto: UpdateMedicineDto) {
    const medicine = await this.prisma.medicamento.findUnique({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException('Medicamento no encontrado')
    }

    return this.prisma.medicamento.update({
      where: { id },
      data: updateMedicineDto,
    });
  }

  async remove(id: number) {
    const medicine = await this.prisma.medicamento.findUnique({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException('Medicamento no encontrado');
    }

    return this.prisma.medicamento.delete({
      where: { id },
    });
  }
}
