import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @ApiOperation({ summary: 'Registrar un nuevo médico' })
  @ApiResponse({ status: 201, description: 'Médico registrado exitosamente' })
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @ApiOperation({ summary: 'Listar todos los médicos' })
  @ApiResponse({ status: 200, description: 'Lista de médicos' })
  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un médico por su ID' })
  @ApiResponse({ status: 200, description: 'Médico encontrado' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }*/
}
