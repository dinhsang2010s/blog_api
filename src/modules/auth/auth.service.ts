import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserService } from '../user/user.service';
import { UpdateLoginRequest, UpdateRegisterRequest } from 'src/models/requests';
import { AuthInterface } from 'src/interfaces/auth.interface';
import type { IToken } from 'src/models/dtos/token';

@Injectable()
export class AuthService implements AuthInterface {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param registerDto - User registration data
   * @returns Promise with user name
   * @throws ConflictException if user already exists
   */
  async register(
    registerDto: UpdateRegisterRequest,
  ): Promise<{ name: string }> {
    const { name, password } = registerDto;

    await this.validateUserDoesNotExist(name);
    const hashedPassword = await this.hashPassword(password);

    await this.userService.add({
      name,
      password: hashedPassword,
    });

    return { name };
  }

  /**
   * Authenticate user and generate JWT token
   * @param loginDto - User login credentials
   * @returns Promise with JWT token
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: UpdateLoginRequest): Promise<IToken> {
    const { name, password } = loginDto;

    const user = await this.findAndValidateUser(name);
    await this.validatePassword(password, user.password);

    const token = await this.generateJwtToken(user._id);

    return {
      type: 'Bearer',
      accessToken: token,
    };
  }

  /**
   * Check if user already exists
   * @param name - Username to check
   * @throws ConflictException if user exists
   */
  private async validateUserDoesNotExist(name: string): Promise<void> {
    const existingUser = await this.userService.getOne(name);
    if (existingUser) {
      throw new ConflictException('User with this name already exists');
    }
  }

  /**
   * Hash password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Find user by name and validate existence
   * @param name - Username to find
   * @returns User object
   * @throws UnauthorizedException if user not found
   */
  private async findAndValidateUser(name: string) {
    const user = await this.userService.getOne(name);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return user;
  }

  /**
   * Validate password against hashed password
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @throws UnauthorizedException if password is invalid
   */
  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  /**
   * Generate JWT token for user
   * @param userId - User ID to include in token
   * @returns JWT token string
   */
  private async generateJwtToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ id: userId });
  }
}
