import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { promisify } from 'node:util';

@Injectable()
export class RandomService {
  private readonly logger = new Logger(RandomService.name);

  async generateRandomToken(size: number = 32): Promise<string> {
    try {
      const buffer = await promisify(crypto.randomBytes)(size);
      return buffer.toString('hex');
    } catch (error) {
      this.logger.error('Error generating random token:', error);
      throw error;
    }
  }

  async generateRandomPassword(): Promise<string> {
    try {
      const buffer = await promisify(crypto.randomBytes)(16);
      const hexString = buffer.toString('hex');
      return hexString.slice(0, 16);
    } catch (error) {
      this.logger.error('Error generating random password:', error);
      throw error;
    }
  }
}
