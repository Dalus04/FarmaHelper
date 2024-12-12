import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PharmacistService } from './pharmacist.service';
import { CreatePharmacistDto } from './dto/create-pharmacist.dto';
import { UpdatePharmacistDto } from './dto/update-pharmacist.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('pharmacist')
@Controller('pharmacist')
export class PharmacistController {
  constructor(private readonly pharmacistService: PharmacistService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un farmacéutico (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create')
  create(@Body() createPharmacistDto: CreatePharmacistDto) {
    return this.pharmacistService.create(createPharmacistDto);
  }

  @ApiOperation({ summary: 'Obtener todos los farmacéuticos' })
  @Get()
  findAll() {
    return this.pharmacistService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un farmacéutico por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacistService.findOne(+id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updatePharmacistDto: UpdatePharmacistDto) {
    return this.pharmacistService.update(+id, updatePharmacistDto);
  }*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un farmacéutico por su ID (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacistService.remove(+id);
  }
}
