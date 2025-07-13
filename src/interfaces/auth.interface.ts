import { IToken } from 'src/models/dtos/token';
import { UpdateLoginRequest, UpdateRegisterRequest } from 'src/models/requests';

export interface AuthInterface {
  login(model: UpdateLoginRequest): Promise<IToken>;
  register(registerDto: UpdateRegisterRequest): Promise<{ name: string }>;
}
