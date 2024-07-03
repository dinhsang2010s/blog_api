import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  LoginDto,
  RegisterDto,
} from 'src/models/dtos/request.dtos/request.dtos';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Error } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ name: string }> {
    const { name, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.add({
      name,
      password: hashedPassword,
    });
    return { name };
  }

  async login(model: LoginDto): Promise<IToken> {
    const { name, password } = model;

    try {
      const user = await this.userService.getOne(name);
      if (!user) throw Error;

      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) throw Error;

      const token = await this.jwtService.signAsync({ id: user._id });
      return {
        type: 'Bearer',
        accessToken: token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid username or password!');
    }
  }
}
