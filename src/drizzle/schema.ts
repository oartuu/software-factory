import { date, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

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
  name: varchar('name').notNull(),
  paymentStatus: varchar('payment_status').notNull(),
  createdAt: date('created_at').notNull(),
});