import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: { name: string; email: string; password: string; role?: string }) {
    console.log('🔐 Tentative d\'inscription:', { email: data.email, name: data.name });
    try {
      const user = await this.userService.createUser(data);
      console.log('✅ Utilisateur créé avec succès:', { id: user.id, email: user.email });
      return { id: user.id, email: user.email, name: user.name, role: user.role };
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string) {
    console.log('🔐 Tentative de connexion pour:', email);
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        console.log('❌ Utilisateur non trouvé:', email);
        return null;
      }
      console.log('✅ Utilisateur trouvé:', { id: user.id, email: user.email });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('❌ Mot de passe incorrect pour:', email);
        return null;
      }
      console.log('✅ Mot de passe correct pour:', email);
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de la validation:', error);
      return null;
    }
  }

  async login(user: any) {
    console.log('🔐 Génération du token pour:', user.email);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    console.log('✅ Token généré avec succès');
    return {
      access_token: token,
    };
  }
}
