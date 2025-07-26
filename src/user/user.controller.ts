import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.userService.findById(req.user.userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
