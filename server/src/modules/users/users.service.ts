import { Injectable, ConflictException } from '@nestjs/common';
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

  /*findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }*/
}
