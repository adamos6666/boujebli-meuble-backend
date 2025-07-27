import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type ProduitStandard = {
  id: number;
  titre: string;
  description: string;
  image: string | null;
  langues: string[];
};
import { CreateProduitStandardDto } from './dto/create-produit-standard.dto';
import { UpdateProduitStandardDto } from './dto/update-produit-standard.dto';

const prisma = new PrismaClient();

@Injectable()
export class ProduitStandardService {
  async create(data: CreateProduitStandardDto): Promise<ProduitStandard> {
    return prisma.produitStandard.create({ data });
  }

  async findAll(langue?: string): Promise<ProduitStandard[]> {
    try {
      const where = langue ? {
        langues: {
          has: langue
        }
      } : {};
      
      const produits = await prisma.produitStandard.findMany({ where });
      console.log(`✅ ${produits.length} produits trouvés${langue ? ` pour la langue ${langue}` : ''}`);
      return produits;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des produits:', error);
      throw new Error('Erreur de base de données lors de la récupération des produits');
    }
  }

  async findOne(id: number): Promise<ProduitStandard> {
    console.log(`🔍 Service: Recherche du produit avec l'ID: ${id}`);
    
    if (!id || isNaN(id) || id <= 0) {
      throw new Error(`ID invalide dans le service: ${id}`);
    }
    
    try {
      const produit = await prisma.produitStandard.findUnique({ 
        where: { id: Number(id) } 
      });
      
      if (!produit) {
        throw new NotFoundException(`Produit standard avec l'ID ${id} non trouvé`);
      }
      
      console.log(`✅ Produit trouvé: ${produit.titre}`);
      return produit;
    } catch (error) {
      console.error(`❌ Erreur lors de la recherche du produit ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateProduitStandardDto): Promise<ProduitStandard> {
    await this.findOne(id); // Vérifie que le produit existe
    return prisma.produitStandard.update({ where: { id }, data });
  }

  async remove(id: number): Promise<ProduitStandard> {
    await this.findOne(id); // Vérifie que le produit existe
    return prisma.produitStandard.delete({ where: { id } });
  }
}
