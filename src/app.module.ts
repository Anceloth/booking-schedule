import { Module } from '@nestjs/common';
import { BookingScheduleModule } from './booking-schedule.module';

@Module({
  imports: [BookingScheduleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
