import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateRegisterRequest } from 'src/models/requests';
import { IUser } from 'src/models/dtos/user';
import { User } from 'src/models/schemas/user.schema';
import { UserInterface } from 'src/interfaces/user.interface';

@Injectable()
export class UserService implements UserInterface {
  constructor(
    @InjectModel(User.name)
    private users: Model<IUser>,
  ) {}

  async getOne(name: string): Promise<IUser> {
    return this.users.findOne({ name });
  }

  async add(registerDto: UpdateRegisterRequest): Promise<void> {
    await this.users.create(registerDto);
  }
}
