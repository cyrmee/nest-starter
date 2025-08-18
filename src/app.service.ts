import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      status: 'online',
      documentation: {
        swagger: '/api/docs',
      },
    };
  }
}
