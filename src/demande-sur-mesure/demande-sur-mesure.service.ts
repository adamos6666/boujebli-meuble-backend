import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, DemandeSurMesure } from '../../generated/prisma';
import { CreateDemandeSurMesureDto } from './dto/create-demande-sur-mesure.dto';
import { UpdateDemandeSurMesureDto } from './dto/update-demande-sur-mesure.dto';

const prisma = new PrismaClient();

@Injectable()
export class DemandeSurMesureService {
  async create(data: CreateDemandeSurMesureDto): Promise<DemandeSurMesure> {
    return prisma.demandeSurMesure.create({ data });
  }

  async findAll(clientId?: number): Promise<DemandeSurMesure[]> {
    const where = clientId ? { clientId } : {};
    return prisma.demandeSurMesure.findMany({ where });
  }

  async findOne(id: number): Promise<DemandeSurMesure> {
    const demande = await prisma.demandeSurMesure.findUnique({ where: { id } });
    if (!demande) {
      throw new NotFoundException(`Demande sur mesure avec l'ID ${id} non trouvée`);
    }
    return demande;
  }

  async update(id: number, data: UpdateDemandeSurMesureDto): Promise<DemandeSurMesure> {
    await this.findOne(id);
    return prisma.demandeSurMesure.update({ where: { id }, data });
  }

  async remove(id: number): Promise<DemandeSurMesure> {
    await this.findOne(id);
    return prisma.demandeSurMesure.delete({ where: { id } });
  }
}
