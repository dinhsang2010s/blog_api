import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/models/dtos/request.dtos/request.dtos';
import { IUser } from 'src/models/dtos/response.dtos/user';
import { User } from 'src/models/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private users: Model<IUser>,
  ) {}

  async getOne(name: string): Promise<IUser> {
    return this.users.findOne({ name });
  }

  async add(registerDto: RegisterDto): Promise<void> {
    await this.users.create(registerDto);
  }
}
