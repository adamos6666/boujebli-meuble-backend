import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TraductionService } from './traduction.service';
import { CreateTraductionDto } from './dto/create-traduction.dto';
import { UpdateTraductionDto } from './dto/update-traduction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('traduction')
@Controller('traduction')
export class TraductionController {
  constructor(private readonly traductionService: TraductionService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les traductions' })
  @ApiQuery({ name: 'langue', required: false, description: 'Filtrer par langue' })
  @ApiResponse({ status: 200, description: 'Liste des traductions' })
  async findAll(@Query('langue') langue?: string) {
    return this.traductionService.findAll(langue);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une traduction par ID' })
  @ApiResponse({ status: 200, description: 'Traduction trouvée' })
  @ApiResponse({ status: 404, description: 'Traduction non trouvée' })
  async findOne(@Param('id') id: string) {
    return this.traductionService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une nouvelle traduction' })
  @ApiResponse({ status: 201, description: 'Traduction créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body(ValidationPipe) createDto: CreateTraductionDto) {
    return this.traductionService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une traduction' })
  @ApiResponse({ status: 200, description: 'Traduction mise à jour' })
  @ApiResponse({ status: 404, description: 'Traduction non trouvée' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateDto: UpdateTraductionDto) {
    return this.traductionService.update(Number(id), updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une traduction' })
  @ApiResponse({ status: 200, description: 'Traduction supprimée' })
  @ApiResponse({ status: 404, description: 'Traduction non trouvée' })
  async remove(@Param('id') id: string) {
    return this.traductionService.remove(Number(id));
  }
}
