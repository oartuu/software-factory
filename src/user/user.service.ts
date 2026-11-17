import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/index.js';
import {  and, asc, eq, gte, inArray} from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getUserData(userId: string, userName: string) {
    const userMemberships = await this.db
      .select({ groupId: schema.groupMember.groupId })
      .from(schema.groupMember)
      .where(eq(schema.groupMember.userId, userId));

    const groupIds = userMemberships.map((m) => m.groupId);

    let userData = {

        name: userName,
        groups: await this.db.query.group.findMany({
      where: inArray(schema.group.id, groupIds),
      with: {
        members: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        events: true
      },
    }),
        nextEvent: await this.db
    .select()
    .from(schema.event)
    .where(
      and(
        inArray(schema.event.groupId, groupIds),
        gte(schema.event.startDate, new Date()) 
      )
    )
    .orderBy(asc(schema.event.startDate))
    .limit(1)
    }

    return userData;
  }
}
