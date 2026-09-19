import {
  date,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';


export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
});

export const refreshToken = pgTable('refresh_token', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const group = pgTable('group', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  authorId: uuid('author_id').references(() => user.id, {
    onDelete: 'cascade',
  }),
  planId: uuid('plan_id').references(() => plan.planId, {
    onDelete: 'cascade',
  }),
  name: varchar('name').notNull(),
  paymentStatus: varchar('payment_status').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const plan = pgTable('plan', {
  planId: uuid('plan_id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  maxUsers: integer('max_users').notNull(),
  price: real('price').notNull(),
  duration: integer('duration').notNull(),
});

export const groupMember = pgTable('group_member', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  groupId: uuid('group_id').references(() => group.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),
  accessLevel: varchar('access_level').notNull(),
  status: varchar('status').notNull(),
  function: text('function').array().notNull(),
});

export const event = pgTable('event', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  groupId: uuid('group_id').references(() => group.id, { onDelete: 'cascade' }),
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

export const setlist = pgTable('setlist', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  groupId: uuid('group_id').references(() => group.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


export const setlistMusic = pgTable('setlist_music', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  setlistId: uuid('setlist_id')
    .references(() => setlist.id, { onDelete: 'cascade' })
    .notNull(),
  musicId: uuid('music_id')
    .references(() => music.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').notNull(), 
});

export const music = pgTable('music', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  groupId: uuid('group_id').references(() => group.id, { onDelete: 'cascade' }),
  name: varchar('name').notNull(),
  artist: varchar('artist').notNull(),
  spotifyLink: text('spotify_link'),
  youtubeLink: text('youtube_link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});