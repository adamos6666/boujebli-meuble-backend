import { Controller, Post, Body, UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Test User' },
        email: { type: 'string', example: 'test@example.com' },
        password: { type: 'string', example: 'password123' }
      },
      required: ['name', 'email', 'password']
    }
  })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Utilisateur déjà existant' })
  async register(@Body() body: { name: string; email: string; password: string }) {
    try {
      const result = await this.authService.register(body);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Utilisateur créé avec succès',
        data: result
      };
    } catch (error) {
      if (error.message === 'Un utilisateur avec cet email existe déjà') {
        throw new HttpException({
          statusCode: HttpStatus.CONFLICT,
          message: 'Un utilisateur avec cet email existe déjà',
          error: 'Conflict'
        }, HttpStatus.CONFLICT);
      }
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        password: { type: 'string', example: 'password123' }
      },
      required: ['email', 'password']
    }
  })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(body.email, body.password);
      if (!user) {
        throw new HttpException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Email ou mot de passe incorrect',
          error: 'Unauthorized'
        }, HttpStatus.UNAUTHORIZED);
      }
      
      const result = await this.authService.login(user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Connexion réussie',
        data: result
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Email ou mot de passe incorrect',
        error: 'Unauthorized'
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('test-user')
  @ApiOperation({ summary: 'Créer un utilisateur de test' })
  @ApiResponse({ status: 200, description: 'Utilisateur de test créé ou existant' })
  async createTestUser() {
    try {
      const user = await this.authService.createTestUser();
      return {
        statusCode: HttpStatus.OK,
        message: 'Utilisateur de test prêt',
        data: {
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erreur lors de la création de l\'utilisateur de test',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('validate')
  @ApiOperation({ summary: 'Valider un token JWT' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      },
      required: ['token']
    }
  })
  @ApiResponse({ status: 200, description: 'Token valide' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async validateToken(@Body() body: { token: string }) {
    try {
      const payload = await this.authService.validateToken(body.token);
      if (!payload) {
        throw new HttpException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Token invalide',
          error: 'Unauthorized'
        }, HttpStatus.UNAUTHORIZED);
      }
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Token valide',
        data: payload
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Token invalide',
        error: 'Unauthorized'
      }, HttpStatus.UNAUTHORIZED);
    }
  }
}
