import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),

  username: varchar('user_name', { length: 66 }).notNull(),

  email: varchar('email', { length: 255 }).unique().notNull(),
  isEmailVerified: boolean('email_verified').default(false).notNull(),

  password: varchar('password', { length: 66 }).notNull(),
  salt: text('salt'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});
