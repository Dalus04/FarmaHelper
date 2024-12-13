import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MedicinesModule } from './modules/medicines/medicines.module';
import { PharmacistModule } from './modules/pharmacist/pharmacist.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    PharmacistModule,
    //PrescriptionsModule,
    MedicinesModule,
    //NotificationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
