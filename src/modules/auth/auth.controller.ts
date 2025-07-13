import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateLoginRequest, UpdateRegisterRequest } from 'src/models/requests';
import { Public } from 'src/guards/objects';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() model: UpdateRegisterRequest) {
    return await this.authService.register(model);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() model: UpdateLoginRequest) {
    return await this.authService.login(model);
  }
}
