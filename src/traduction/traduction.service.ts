import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Traduction } from '../../generated/prisma';
import { CreateTraductionDto } from './dto/create-traduction.dto';
import { UpdateTraductionDto } from './dto/update-traduction.dto';

const prisma = new PrismaClient();

@Injectable()
export class TraductionService {
  async create(data: CreateTraductionDto): Promise<Traduction> {
    return prisma.traduction.create({ data });
  }

  async findAll(langue?: string): Promise<Traduction[]> {
    const where = langue ? { langue } : {};
    return prisma.traduction.findMany({ where });
  }

  async findOne(id: number): Promise<Traduction> {
    const traduction = await prisma.traduction.findUnique({ where: { id } });
    if (!traduction) {
      throw new NotFoundException(`Traduction avec l'ID ${id} non trouvée`);
    }
    return traduction;
  }

  async update(id: number, data: UpdateTraductionDto): Promise<Traduction> {
    await this.findOne(id);
    return prisma.traduction.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Traduction> {
    await this.findOne(id);
    return prisma.traduction.delete({ where: { id } });
  }
}
