import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('medicines')
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @ApiOperation({ summary: 'Crear un nuevo medicamento' })
  @Post('create')
  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicinesService.create(createMedicineDto);
  }

  @ApiOperation({ summary: 'Obtener todos los medicamentos' })
  @Get()
  findAll() {
    return this.medicinesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un medicamento por su ID' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.medicinesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar un medicamento por su ID' })
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateMedicineDto: UpdateMedicineDto) {
    return this.medicinesService.update(+id, updateMedicineDto);
  }

  @ApiOperation({ summary: 'Eliminar un medicamento por su ID' })
  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.medicinesService.remove(+id);
  }
}
