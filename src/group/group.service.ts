import { Inject, Injectable} from '@nestjs/common';
import { CreateGroupDto } from './dto/create.dto.js';
import { DRIZZLE } from '../drizzle/drizzle.module.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/index.js';
import { eq, inArray } from 'drizzle-orm';

@Injectable()
export class GroupService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createGroup(dto: CreateGroupDto, userId: string) {
    return await this.db.transaction(async (tx) => {
      // 1. Cria o grupo
      const [newGroup] = await tx
        .insert(schema.group)
        .values({
          name: dto.name,
          authorId: userId,
        })
        .returning();

      // 2. Adiciona o criador como membro (dono/admin)
      await tx.insert(schema.groupMember).values({
        groupId: newGroup.id,
        userId: userId,
        accessLevel: 'OWNER', // Ou o nível de acesso/role padrão do sistema
        status: 'ACTIVE',
        function: ['Owner'], // Função/cargo dentro da banda/grupo
      });

      return newGroup;
    });
  }

  async getGroupsByUserId(userId: string) {
    // 1. Busca os IDs de todos os grupos dos quais o usuário faz parte
    const userMemberships = await this.db
      .select({ groupId: schema.groupMember.groupId })
      .from(schema.groupMember)
      .where(eq(schema.groupMember.userId, userId));

    const groupIds = userMemberships.map((m) => m.groupId);

    if (groupIds.length === 0) {
      return [];
    }

    // 2. Busca os grupos trazendo o array de membros e os dados do usuário
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
}