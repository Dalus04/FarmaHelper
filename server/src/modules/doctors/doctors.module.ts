import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService, PrismaService, UsersService],
  exports: [DoctorsService],
})
export class DoctorsModule { }
