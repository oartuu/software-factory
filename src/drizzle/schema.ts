import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const refreshToken = pgTable('refresh_token', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const plan = pgTable('plan', {
  id: uuid('id').primaryKey().defaultRandom().notNull(), 
  name: text('name').notNull(),
  maxUsers: integer('max_users').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration').notNull(),
});

export const group = pgTable('group', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  authorId: uuid('author_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  planId: uuid('plan_id')
    .references(() => plan.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name').notNull(),
  paymentStatus: varchar('payment_status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const groupMember = pgTable(
  'group_member',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    groupId: uuid('group_id')
      .references(() => group.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    accessLevel: varchar('access_level').notNull(),
    status: varchar('status').notNull(),
    function: text('function').array().notNull(),
  },
  (table) => [
   
    unique('group_member_user_unique').on(table.groupId, table.userId),
  ],
);

export const setlist = pgTable('setlist', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  groupId: uuid('group_id')
    .references(() => group.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const event = pgTable('event', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  groupId: uuid('group_id')
    .references(() => group.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name').notNull(),
  startDate: timestamp('start_date').notNull(),
  location: text('location').notNull(),
  setListsStatus: varchar('set_lists_status').notNull(),
  setlistId: uuid('setlist_id').references(() => setlist.id, {
    onDelete: 'cascade',
  }),
  playlistSpotify: text('playlist_spotify'),
  playlistYoutube: text('playlist_youtube'),
});

export const music = pgTable('music', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  groupId: uuid('group_id')
    .references(() => group.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name').notNull(),
  artist: varchar('artist').notNull(),
  spotifyLink: text('spotify_link'),
  youtubeLink: text('youtube_link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const setlistMusic = pgTable(
  'setlist_music',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    setlistId: uuid('setlist_id')
      .references(() => setlist.id, { onDelete: 'cascade' })
      .notNull(),
    musicId: uuid('music_id')
      .references(() => music.id, { onDelete: 'cascade' })
      .notNull(),
    order: integer('order').notNull(),
  },
  (table) => [
    unique('setlist_music_unique').on(table.setlistId, table.musicId),
    unique('setlist_order_unique').on(table.setlistId, table.order),
  ],
);
