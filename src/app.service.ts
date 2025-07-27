import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Boujebli Meuble API - Version 1.0.0';
  }
}
