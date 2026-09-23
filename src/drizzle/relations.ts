import { relations } from 'drizzle-orm';
import { group, groupMember, user } from './schema.js'; 

export const groupRelations = relations(group, ({ many }) => ({
  members: many(groupMember),
}));

export const groupMemberRelations = relations(groupMember, ({ one }) => ({
  group: one(group, {
    fields: [groupMember.groupId],
    references: [group.id],
  }),
  user: one(user, {
    fields: [groupMember.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  memberships: many(groupMember),
}));
