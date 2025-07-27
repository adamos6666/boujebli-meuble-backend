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

  // Méthodes manquantes ajoutées
  async findAll(): Promise<User[]> {
    console.log('🔍 Récupération de tous les utilisateurs');
    
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          // Exclure le mot de passe pour la sécurité
        }
      });
      
      console.log(`✅ ${users.length} utilisateurs trouvés`);
      return users as User[];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    console.log('🔍 Recherche d\'utilisateur par ID:', id);
    
    try {
      const user = await prisma.user.findUnique({ 
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
        }
      });
      
      if (!user) {
        console.log('❌ Utilisateur non trouvé:', id);
        throw new Error('Utilisateur non trouvé');
      }
      
      console.log('✅ Utilisateur trouvé:', { id: user.id, email: user.email });
      return user as User;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche d\'utilisateur:', error);
      throw error;
    }
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    console.log('🔄 Mise à jour d\'utilisateur:', id);
    
    try {
      // Si le mot de passe est fourni, le hasher
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      
      const user = await prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      
      console.log('✅ Utilisateur mis à jour:', { id: user.id, email: user.email });
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<User> {
    console.log('🗑️ Suppression d\'utilisateur:', id);
    
    try {
      const user = await prisma.user.delete({
        where: { id },
      });
      
      console.log('✅ Utilisateur supprimé:', { id: user.id, email: user.email });
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }
}
