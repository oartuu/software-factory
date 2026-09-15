import { date, integer, pgTable, real, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone').notNull().unique(),
  createdAt: date('created_at').notNull()
});

export const group = pgTable('group', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  authorId: uuid('author_id').references(() => user.id),
  planId: uuid('plan_id').references(() => plan.planId),
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