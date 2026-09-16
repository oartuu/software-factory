import { date, integer, pgTable, real, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { access } from 'fs';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone').notNull().unique(),
  createdAt: date('created_at').notNull()
});

export const refreshToken = pgTable('refresh_token',{
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: date('expires_at').notNull(),
  createdAt: date('created_at').notNull()
})

export const group = pgTable('group', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  authorId: uuid('author_id').references(() => user.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id').references(() => plan.planId, { onDelete: 'cascade' }),
  name: varchar('name').notNull(),
  paymentStatus: varchar('payment_status').notNull(),
  createdAt: date('created_at').notNull(),
});

export const plan = pgTable('plan', {
  planId: uuid('plan_id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  maxUsers: integer('max_users').notNull(),
  price: real('price').notNull(),
  duration: integer('duration').notNull(),
})

export const groupMember = pgTable('group_member', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  groupId: uuid('group_id').references(() => group.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
  accessLevel: varchar('access_level').notNull(),
  status: varchar('status').notNull(),
  function: text('function').array().notNull(),

})