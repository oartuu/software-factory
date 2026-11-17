import { relations } from 'drizzle-orm';
import { group, groupMember, user, event, } from './schema.js'; 

export const groupRelations = relations(group, ({ many }) => ({
  members: many(groupMember),
  events: many(event),
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

export const eventRelations = relations(event, ({ one }) => ({
  group: one(group, {
    fields: [event.groupId], 
    references: [group.id],
  }),
}));