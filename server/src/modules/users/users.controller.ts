import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Rol } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Registrar un nuevo paciente' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario con este DNI ya existe' })
  @Post('register')
  async registerPatient(@Body() createUserDto: CreateUserDto) {
    createUserDto.rol = Rol.paciente;
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar un nuevo usuario con rol especial (admin, médico, farmacéutico)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario con este DNI ya existe' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('register-special')
  async registerSpecialUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar su propia información' })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateOwnInfo(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información de un usuario (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('update/:id')
  async updateByAdmin(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar su propia cuenta' })
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteOwnAccount(@Request() req) {
    return this.usersService.remove(req.user.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un usuario por su ID (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete/:id')
  async deleteByAdmin(@Param('id') id:number) {
    return this.usersService.remove(+id);
  }

}
