import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
} from 'src/models/dtos/request.dtos/request.dtos';
import { Public } from 'src/guards/objects';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() model: RegisterDto) {
    return await this.authService.register(model);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() model: LoginDto) {
    return await this.authService.login(model);
  }
}
