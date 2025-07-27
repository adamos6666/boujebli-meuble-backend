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
    try {
      console.log(`🔍 Recherche de produits${langue ? ` pour la langue: ${langue}` : ''}`);
      const produits = await this.produitStandardService.findAll(langue);
      console.log(`✅ ${produits.length} produits retournés`);
      return produits; // Retourner directement le tableau
    } catch (error) {
      console.error('❌ Erreur dans le contrôleur produit-standard:', error);
      throw error;
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Test de la connexion à la base de données' })
  async testConnection() {
    try {
      const count = await this.produitStandardService.findAll();
      return {
        message: 'Connexion à la base de données réussie',
        productCount: count.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        message: 'Erreur de connexion à la base de données',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit standard par ID' })
  @ApiResponse({ status: 200, description: 'Produit standard trouvé' })
  @ApiResponse({ status: 404, description: 'Produit standard non trouvé' })
  async findOne(@Param('id') id: string) {
    console.log(`🔍 Recherche du produit avec l'ID: ${id}`);
    
    if (!id || id.trim() === '') {
      throw new Error('ID manquant');
    }
    
    const productId = Number(id);
    if (isNaN(productId) || productId <= 0) {
      throw new Error(`ID invalide: ${id}`);
    }
    
    console.log(`✅ ID validé: ${productId}`);
    return this.produitStandardService.findOne(productId);
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
