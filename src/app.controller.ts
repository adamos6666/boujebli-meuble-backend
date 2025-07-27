import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
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
