import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {  AuthGuard } from '../auth/auth.guard.js';
import type {AuthenticatedRequest,} from '../auth/auth.guard.js';
import { GroupService } from './group.service.js';
import { CreateGroupDto } from './dto/create.dto.js';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  getGroup(@Body() dto: CreateGroupDto, @Req() req: AuthenticatedRequest) {
  
    return this.groupService.createGroup({ name: dto.name }, req.user!.sub);
  }
}
