import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTraductionDto {
  @ApiProperty({ description: 'Clé de la traduction' })
  @IsString()
  @IsNotEmpty()
  cle: string;

  @ApiProperty({ description: 'Valeur de la traduction' })
  @IsString()
  @IsNotEmpty()
  valeur: string;

  @ApiProperty({ description: 'Langue de la traduction' })
  @IsString()
  @IsNotEmpty()
  langue: string;
} 