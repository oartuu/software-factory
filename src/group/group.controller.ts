import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get('list')
  getMyGroups(@Req() req: AuthenticatedRequest) {
    return this.groupService.getGroupsByUserId(req.user!.sub);
  }

  @UseGuards(AuthGuard)
  @Post(':id/invite-link')
  async getInviteLink(@Param('id') groupId: string) {
    return this.groupService.generateInviteLink(groupId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/join')
  async joinGroup(@Param('id') groupId: string, @Req() req: any) {
    const userId = req.user!.sub; 
    return this.groupService.joinGroup(groupId, userId);
  }
}
