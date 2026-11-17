import { Module } from '@nestjs/common';
import { EventService } from './event.service.js';
import { EventController } from './event.controller.js';

@Module({
  providers: [EventService],
  controllers: [EventController]
})
export class EventModule {}
