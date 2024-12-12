import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PrismaService, UsersService],
  exports: [PatientsService],
})
export class PatientsModule { }
