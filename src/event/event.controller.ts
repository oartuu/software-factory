import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import {  AuthGuard } from '../auth/auth.guard.js';
import { CreateEventDto } from './dto/event.dto.js';
import { EventService } from './event.service.js';
import type { AuthenticatedRequest } from '../auth/auth.guard.js';




  @UseGuards(AuthGuard)
  @Controller('event')
  export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post(':id/create')
    async createEvent(
      @Param('id') groupId: string,
      @Body() dto: CreateEventDto,
      @Req() req: AuthenticatedRequest,
    ) {
      return this.eventService.createEvent(groupId, dto);
    }


    @Get(':id/events')
    async getEventsByGroupId(
      @Param('id') groupId: string,
    ) {
      return this.eventService.getEventsByGroupId(groupId);
    }

    @Get(':id')
    async getEventById(
      @Param('id') eventId: string,
    ) {
      return this.eventService.getEventById(eventId);
    }

    @Delete(':id/delete')
    async deleteEvent(
      @Param('id') eventId: string,
    ) {
      return this.eventService.deleteEvent(eventId);
    }
  }
