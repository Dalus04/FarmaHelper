import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear información del propio médico' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOwnInfo(@Request() req, @Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(req.user.userId, createDoctorDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear información de un médico (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create/:idUsuario')
  async createByAdmin(@Param('idUsuario') idUsuario: number, @Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(+idUsuario, createDoctorDto);
  }

  @ApiOperation({ summary: 'Obtener todos los médicos' })
  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un médico por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar especialidad del propio médico' })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateOwnInfo(@Request() req, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.updateOwnInfo(req.user.userId, updateDoctorDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar especialidad de un médico (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('update/:id')
  async updateByAdmin(@Param('id') id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.updateByAdmin(+id, updateDoctorDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un médico por su ID (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }
}
