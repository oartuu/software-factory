import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create.dto.js';
import { DRIZZLE } from '../drizzle/drizzle.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/index.js';
import { and, eq, inArray } from 'drizzle-orm';

@Injectable()
export class GroupService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createGroup(dto: CreateGroupDto, userId: string) {
    return await this.db.transaction(async (tx) => {
      const [newGroup] = await tx
        .insert(schema.group)
        .values({
          name: dto.name,
          authorId: userId,
        })
        .returning();

      await tx.insert(schema.groupMember).values({
        groupId: newGroup.id,
        userId: userId,
        accessLevel: 'OWNER',
        status: 'ACTIVE',
        function: ['Owner'],
      });

      return newGroup;
    });
  }

  async getGroupsByUserId(userId: string) {
    const userMemberships = await this.db
      .select({ groupId: schema.groupMember.groupId })
      .from(schema.groupMember)
      .where(eq(schema.groupMember.userId, userId));

    const groupIds = userMemberships.map((m) => m.groupId);

    if (groupIds.length === 0) {
      return [];
    }

    const groups = await this.db.query.group.findMany({
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
      },
    });

    return groups;
  }

  async generateInviteLink(groupId: string) {
    const group = await this.db.query.group.findFirst({
      where: eq(schema.group.id, groupId),
    });

    if (!group) {
      throw new NotFoundException('Group not found.');
    }

    return {
      inviteUrl: `${process.env.FRONTEND_URL}/groups/join/${groupId}`,
    };
  }

  async joinGroup(groupId: string, userId: string) {
    const group = await this.db.query.group.findFirst({
      where: eq(schema.group.id, groupId),
    });

    if (!group) {
      throw new NotFoundException('Group not found.');
    }

    const existingMember = await this.db.query.groupMember.findFirst({
      where: and(
        eq(schema.groupMember.groupId, groupId),
        eq(schema.groupMember.userId, userId),
      ),
    });

    if (existingMember) {
      throw new ConflictException('You are already a member of this group.');
    }

    await this.db.insert(schema.groupMember).values({
      groupId,
      userId,
      accessLevel: 'MEMBER',
      status: 'ACTIVE',
      function: ['Member'],
    });

    return { message: 'You have successfully joined the group!' };
  }
}
