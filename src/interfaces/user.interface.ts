import { UpdateRegisterRequest } from 'src/models/requests';
import { IUser } from 'src/models/dtos/user';

export interface UserInterface {
  getOne(name: string): Promise<IUser>;
  add(registerDto: UpdateRegisterRequest): Promise<void>;
}
