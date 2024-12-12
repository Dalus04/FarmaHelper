import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear información del propio paciente' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOwnInfo(@Request() req, @Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(req.user.userId, createPatientDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear información de un paciente (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create/:idUsuario')
  async createByAdmin(@Param('idUsuario') idUsuario: number, @Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(+idUsuario, createPatientDto);
  }

  @ApiOperation({ summary: 'Obtener todos los pacientes' })
  @Get()
  async findAll() {
    return this.patientsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener información de un paciente por su ID' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.patientsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información del propio paciente' })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateOwnInfo(@Request() req, @Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.updateOwnInfo(req.user.userId, createPatientDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información de un paciente (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('update/:idUsuario')
  async updateByAdmin(@Param('id') id: number, @Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.updateByAdmin(+id, createPatientDto);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un paciente por su ID (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
