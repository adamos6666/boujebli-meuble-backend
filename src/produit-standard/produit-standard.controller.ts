import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProduitStandardService } from './produit-standard.service';
import { CreateProduitStandardDto } from './dto/create-produit-standard.dto';
import { UpdateProduitStandardDto } from './dto/update-produit-standard.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('produit-standard')
@Controller('produit-standard')
export class ProduitStandardController {
  constructor(private readonly produitStandardService: ProduitStandardService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les produits standards' })
  @ApiQuery({ name: 'langue', required: false, description: 'Filtrer par langue' })
  @ApiResponse({ status: 200, description: 'Liste des produits standards' })
  async findAll(@Query('langue') langue?: string) {
    return this.produitStandardService.findAll(langue);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit standard par ID' })
  @ApiResponse({ status: 200, description: 'Produit standard trouvé' })
  @ApiResponse({ status: 404, description: 'Produit standard non trouvé' })
  async findOne(@Param('id') id: string) {
    return this.produitStandardService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau produit standard' })
  @ApiResponse({ status: 201, description: 'Produit standard créé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body(ValidationPipe) createDto: CreateProduitStandardDto) {
    return this.produitStandardService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un produit standard' })
  @ApiResponse({ status: 200, description: 'Produit standard mis à jour' })
  @ApiResponse({ status: 404, description: 'Produit standard non trouvé' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updateDto: UpdateProduitStandardDto) {
    return this.produitStandardService.update(Number(id), updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un produit standard' })
  @ApiResponse({ status: 200, description: 'Produit standard supprimé' })
  @ApiResponse({ status: 404, description: 'Produit standard non trouvé' })
  async remove(@Param('id') id: string) {
    return this.produitStandardService.remove(Number(id));
  }
}
