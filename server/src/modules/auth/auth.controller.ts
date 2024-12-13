import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Iniciar sesión con DNI' })
  @ApiResponse({ status: 200, description: 'Incio de sesión exitoso' })
  @ApiResponse({ status: 400, description: 'DNI o contraseña incorrectos' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { dni, password } = loginDto;
    return this.authService.login(dni, password);
  }

}
