import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async sigIn(authCredentialsDto: AuthCredentialsDto) {
    const result = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!result) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    console.log(result);
  }
}
