import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authcredentialsdto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.sigIn(authcredentialsdto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user) {
    console.log(user);
  }
}
