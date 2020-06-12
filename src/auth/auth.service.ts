import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth Service');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async sigIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; username: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(
      `JWT generated for ${username} with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken, username };
  }
}
