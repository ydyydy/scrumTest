// src/users/admin-initializer.service.ts
import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { UserService } from './application/user.service';

@Injectable()
export class AdminInitializer implements OnApplicationBootstrap {
  constructor(private readonly usersService: UserService) {}

  async onApplicationBootstrap() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Password1';
    const adminUsername = 'Administrador';

    try {
      // Intentamos obtener el usuario
      await this.usersService.getUserByEmail(adminEmail);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Solo si es NotFoundException, creamos el usuario
        await this.usersService.createUser(
          adminEmail,
          adminPassword,
          adminUsername,
          true,
        );
      } else {
        // Para otros errores, los relanzamos
        throw error;
      }
    }
  }
}
