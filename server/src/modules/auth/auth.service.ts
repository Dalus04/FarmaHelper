import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(dni: string, password: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { dni },
    });

    if (user && (await bcrypt.compare(password, user.contraseña))) {
      const { contraseña, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('DNI o contraseña incorrectos');
  }

  async login(dni: string, password: string) {
    const user = await this.validateUser(dni, password);
    const payload = { sub: user.id, dni: user.dni, rol: user.rol }

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
