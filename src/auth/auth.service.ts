import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
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
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.userService.findByEmail(data.email);
      if (existingUser) {
        console.log('❌ Utilisateur déjà existant:', data.email);
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }

      const user = await this.userService.createUser(data);
      console.log('✅ Utilisateur créé avec succès:', { id: user.id, email: user.email });
      
      // Retourner les informations sans le mot de passe
      const { password, ...userWithoutPassword } = user;
      return {
        message: 'Utilisateur créé avec succès',
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erreur lors de la création de l\'utilisateur');
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
      
      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('❌ Erreur lors de la validation:', error);
      return null;
    }
  }

  async login(user: any) {
    console.log('🔐 Génération du token pour:', user.email);
    const payload = { 
      sub: user.id, 
      email: user.email, 
      name: user.name,
      role: user.role || 'client' 
    };
    const token = this.jwtService.sign(payload);
    console.log('✅ Token généré avec succès');
    return {
      message: 'Connexion réussie',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'client'
      }
    };
  }

  // Méthode pour créer un utilisateur de test
  async createTestUser() {
    const testUser = {
      name: 'Test User',
      email: 'test@boujebli.com',
      password: 'test123',
      role: 'client'
    };

    try {
      const existingUser = await this.userService.findByEmail(testUser.email);
      if (existingUser) {
        console.log('✅ Utilisateur de test déjà existant');
        return existingUser;
      }

      const user = await this.userService.createUser(testUser);
      console.log('✅ Utilisateur de test créé:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Erreur création utilisateur de test:', error);
      throw error;
    }
  }

  // Méthode pour valider un token
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      console.error('❌ Token invalide:', error);
      return null;
    }
  }
}
