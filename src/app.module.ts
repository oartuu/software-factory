import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module.js';
import { AuthModule } from './auth/auth.module.js';
import { GroupModule } from './group/group.module.js';
import { EventModule } from './event/event.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    AuthModule,
    GroupModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
