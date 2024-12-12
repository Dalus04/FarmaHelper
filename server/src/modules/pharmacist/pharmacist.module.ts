import { Module } from '@nestjs/common';
import { PharmacistService } from './pharmacist.service';
import { PharmacistController } from './pharmacist.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [PharmacistController],
  providers: [PharmacistService, PrismaService, UsersService],
  exports: [PharmacistService],
})
export class PharmacistModule {}
