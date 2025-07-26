import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DemandeSurMesureService } from './demande-sur-mesure.service';
import { CreateDemandeSurMesureDto } from './dto/create-demande-sur-mesure.dto';
import { UpdateDemandeSurMesureDto } from './dto/update-demande-sur-mesure.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('demande-sur-mesure')
@Controller('demande-sur-mesure')
export class DemandeSurMesureController {
  constructor(private readonly demandeSurMesureService: DemandeSurMesureService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les demandes sur mesure' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrer par clientId' })
  @ApiResponse({ status: 200, description: 'Liste des demandes sur mesure' })
  async findAll(@Query('clientId') clientId?: string) {
    return this.demandeSurMesureService.findAll(clientId ? Number(clientId) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une demande sur mesure par ID' })
  @ApiResponse({ status: 200, description: 'Demande sur mesure trouvée' })
  @ApiResponse({ status: 404, description: 'Demande sur mesure non trouvée' })
  async findOne(@Param('id') id: string) {
    return this.demandeSurMesureService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une nouvelle demande sur mesure' })
  @ApiResponse({ status: 201, description: 'Demande sur mesure créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body(ValidationPipe) createDto: CreateDemandeSurMesureDto) {
    return this.demandeSurMesureService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une demande sur mesure' })
  @ApiResponse({ status: 200, description: 'Demande sur mesure mise à jour' })
  @ApiResponse({ status: 404, description: 'Demande sur mesure non trouvée' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateDto: UpdateDemandeSurMesureDto) {
    return this.demandeSurMesureService.update(Number(id), updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une demande sur mesure' })
  @ApiResponse({ status: 200, description: 'Demande sur mesure supprimée' })
  @ApiResponse({ status: 404, description: 'Demande sur mesure non trouvée' })
  async remove(@Param('id') id: string) {
    return this.demandeSurMesureService.remove(Number(id));
  }
}
