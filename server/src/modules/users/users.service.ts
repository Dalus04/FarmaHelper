import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { dni, email, contraseña, nombre, apellido, rol, telefono } = createUserDto;

    const existingUser = await this.prisma.usuario.findUnique({ where: { dni } });
    if (existingUser) {
      throw new ConflictException('El usuario con este DNI ya existe')
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    return this.prisma.usuario.create({
      data: {
        dni,
        email,
        contraseña: hashedPassword,
        nombre,
        apellido,
        rol,
        telefono,
      },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany()
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.usuario.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: {id},
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.usuario.delete({
      where: {id},
    });
  }
}
