import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create.dto.js';
import { DRIZZLE } from '../drizzle/drizzle.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class GroupService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
   
  ) {}

  async createGroup(dto: CreateGroupDto, id: string) {

    const newGroup = await this.db
      .insert(schema.group)
      .values({
        name: dto.name,
        authorId: id,
      })
      .returning();

    return newGroup[0];
  }

  async getGroupsByUserId(id: string) {

  const groups = await this.db.select().from(schema.group).where(eq(schema.group.authorId, id)).execute();

  return groups;
  }
}
