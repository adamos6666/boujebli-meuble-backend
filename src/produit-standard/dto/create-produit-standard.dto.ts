import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProduitStandardDto {
  @ApiProperty({ description: 'Titre du produit' })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty({ description: 'Description du produit' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'URL de l\'image du produit', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Langues disponibles', example: ['fr', 'en', 'ar'] })
  @IsArray()
  @IsString({ each: true })
  langues: string[];
} 