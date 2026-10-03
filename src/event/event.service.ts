import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/event.dto.js';
import * as schema from '../drizzle/index.js';
import { and, eq, inArray } from 'drizzle-orm';
import { DRIZZLE } from '../drizzle/drizzle.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class EventService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}


  async createEvent(groupId: string, dto: CreateEventDto) {
    const event = await this.db
      .insert(schema.event)
      .values({
        groupId,
        name: dto.name,
        startDate: dto.startDate,
        location: dto.location,
      })
      .returning();

    return event;
  }


  async getEventsByGroupId(groupId: string) {
    const events = await this.db.query.event.findMany({
      where: eq(schema.event.groupId, groupId),
    });

    return events;
  }

  async getEventById(eventId: string) {
    const event = await this.db.query.event.findFirst({
      where: eq(schema.event.id, eventId),
    });

    return event;
  }

  async deleteEvent(eventId: string) {
    const deletedEvent = await this.db
      .delete(schema.event)
      .where(eq(schema.event.id, eventId))
      .returning();

    return deletedEvent;
  }

}
