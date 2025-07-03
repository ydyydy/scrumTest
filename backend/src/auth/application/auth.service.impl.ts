import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/application/user.service';
import { AuthService } from './auth.service';
import { Role } from '../../../common/utils/enum';

@Injectable()
export class AuthServiceImpl implements AuthService {
  logger = new Logger(AuthServiceImpl.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.getUserByEmail(email);
      const isPasswordValid = await user.isValidPassword(password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      // Payload for the JWT
      const rol = user.isAdmin ? Role.ADMIN : Role.USER;

      const payload = { sub: user.id, email: user.email, roles: rol };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error('Error signing in', error);
      throw new UnauthorizedException('Invalid email');
    }
  }
}
