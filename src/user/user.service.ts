import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async createUser(data: { name: string; email: string; password: string; role?: string }): Promise<User> {
    console.log('👤 Création d\'utilisateur:', { email: data.email, name: data.name });
    
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.findByEmail(data.email);
      if (existingUser) {
        console.log('❌ Utilisateur déjà existant:', data.email);
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
      
      const hashedPassword = await bcrypt.hash(data.password, 10);
      console.log('🔐 Mot de passe hashé avec succès');
      
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role || 'client',
        },
      });
      
      console.log('✅ Utilisateur créé avec succès:', { id: user.id, email: user.email });
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log('🔍 Recherche d\'utilisateur par email:', email);
    
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        console.log('✅ Utilisateur trouvé:', { id: user.id, email: user.email });
      } else {
        console.log('❌ Utilisateur non trouvé:', email);
      }
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche d\'utilisateur:', error);
      return null;
    }
  }

  async findById(id: number): Promise<User | null> {
    console.log('🔍 Recherche d\'utilisateur par ID:', id);
    
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) {
        console.log('✅ Utilisateur trouvé:', { id: user.id, email: user.email });
      } else {
        console.log('❌ Utilisateur non trouvé:', id);
      }
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche d\'utilisateur:', error);
      return null;
    }
  }
}
