import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDemandeSurMesureDto {
  @ApiProperty({ description: 'Nom de la demande' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ description: 'Dimensions de la demande' })
  @IsString()
  @IsNotEmpty()
  dimensions: string;

  @ApiProperty({ description: 'URL de l\'image', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'ID du client' })
  @IsInt()
  clientId: number;
} 