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
    const where = langue ? {
      langues: {
        has: langue
      }
    } : {};
    
    return prisma.produitStandard.findMany({ where });
  }

  async findOne(id: number): Promise<ProduitStandard> {
    const produit = await prisma.produitStandard.findUnique({ where: { id } });
    if (!produit) {
      throw new NotFoundException(`Produit standard avec l'ID ${id} non trouvé`);
    }
    return produit;
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
