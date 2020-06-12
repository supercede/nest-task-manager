import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import { JwtPayload } from './jwt-payload';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

const jwtConfig = config.get('jwt');
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;

    const user = await this.userRepository.find({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
