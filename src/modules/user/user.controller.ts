import { Controller, Get, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IUserRequest } from 'src/models/requests/user.request';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: Request & { user: IUserRequest }) {
    return req.user;
  }
}
