import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint de santé de l\'API' })
  @ApiResponse({ status: 200, description: 'API fonctionnelle' })
  getHello(): object {
    return {
      message: 'Boujebli Meuble API',
      version: '1.0.0',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Vérification de santé détaillée' })
  @ApiResponse({ status: 200, description: 'Statut détaillé de l\'API' })
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
    };
  }

  @Get('info')
  @ApiOperation({ summary: 'Informations sur l\'API' })
  @ApiResponse({ status: 200, description: 'Informations détaillées' })
  getInfo(): object {
    return {
      name: 'Boujebli Meuble API',
      description: 'API pour la gestion des meubles sur mesure',
      version: '1.0.0',
      author: 'Boujebli Meuble',
      endpoints: {
        auth: '/auth',
        products: '/produit-standard',
        translations: '/traduction',
        demands: '/demande-sur-mesure',
        users: '/user',
        swagger: '/api',
      },
      features: [
        'Authentification JWT',
        'Gestion des produits',
        'Système de traductions',
        'Demandes sur mesure',
        'Documentation Swagger',
        'Validation des données',
        'CORS configuré',
      ],
    };
  }

  @Post('seed')
  async runSeed() {
    try {
      console.log('🌱 Démarrage du seed manuel...');
      
      // Importer et exécuter le seed
      const { execSync } = require('child_process');
      const result = execSync('npx ts-node seed.ts', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      console.log('✅ Seed exécuté avec succès:', result);
      
      return {
        success: true,
        message: 'Seed exécuté avec succès',
        output: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erreur lors du seed:', error);
      return {
        success: false,
        message: 'Erreur lors du seed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('test')
  getTest(): { message: string; routes: string[] } {
    return {
      message: 'Backend is working!',
      routes: [
        '/health',
        '/produit-standard',
        '/auth/login',
        '/auth/register',
        '/traduction'
      ]
    };
  }

  @Get('produit-standard')
  async getProduitsTest() {
    try {
      // Import dynamique pour éviter les problèmes de module
      const { ProduitStandardService } = await import('./produit-standard/produit-standard.service');
      const service = new ProduitStandardService();
      const produits = await service.findAll();
      return {
        success: true,
        count: produits.length,
        produits: produits.slice(0, 3), // Retourner seulement les 3 premiers
        message: 'Produits récupérés avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erreur lors de la récupération des produits'
      };
    }
  }

  @Get('produit-standard/test')
  async testProduits() {
    try {
      // Test de connexion à la base de données
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      // Test simple de connexion
      await prisma.$connect();
      
      // Compter les produits
      const count = await prisma.produitStandard.count();
      
      await prisma.$disconnect();
      
      return {
        message: 'Route produit-standard accessible',
        timestamp: new Date().toISOString(),
        status: 'OK',
        databaseConnected: true,
        productCount: count
      };
    } catch (error) {
      console.error('Erreur de base de données:', error);
      return {
        message: 'Erreur de base de données',
        timestamp: new Date().toISOString(),
        status: 'ERROR',
        databaseConnected: false,
        error: error.message
      };
    }
  }
}
