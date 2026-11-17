import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import {  AuthGuard } from '../auth/auth.guard.js';
import type { AuthenticatedRequest } from '../auth/auth.guard.js';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('data')
  async getUserData(@Req() req: AuthenticatedRequest) {
    return this.userService.getUserData(req.user!.sub, req.user!.name);
  }
}
