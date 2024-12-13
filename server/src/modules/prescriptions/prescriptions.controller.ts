import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) { }

  @ApiOperation({ summary: 'Crear una nueva receta' })
  @Post('create')
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @ApiOperation({ summary: 'Obtener todas las recetas' })
  @Get()
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una receta por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar una receta' })
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(+id, updatePrescriptionDto);
  }

  @ApiOperation({ summary: 'Eliminar una receta' })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(+id);
  }
}
