import { Module } from '@nestjs/common';
import { GroupService } from './group.service.js';
import { GroupController } from './group.controller.js';

@Module({
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
