import { Injectable } from '@nestjs/common';
import { CryptoService } from '../common/crypto.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppSettingsDto } from './dto/create-app-settings.dto';
import { UpdateAppSettingsDto } from './dto/update-app-settings.dto';

@Injectable()
export class AppSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  /**
   * Find app settings for a specific user
   */
  async getAppSettings(userId: string) {
    return this.prisma.appSettings.findUnique({
      where: { userId },
      select: {
        id: true,
        themePreference: true,
        onboarded: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  }

  /**
   * Create app settings for a user
   * @param command - The command containing user ID and optional settings
   */
  async create(userId: string, dto: CreateAppSettingsDto): Promise<void> {
    const existing = await this.prisma.appSettings.findUnique({ where: { userId } });
    if (existing) return;
    await this.prisma.appSettings.create({
      data: {
        themePreference: dto.themePreference ?? 'system',
        user: { connect: { id: userId } },
      },
    });
  }

  /**
   * Update app settings for a user
   * @param command - The command containing user ID and settings to update
   */
  async update(userId: string, dto: UpdateAppSettingsDto): Promise<void> {
    const appSettings = await this.prisma.appSettings.findUnique({ where: { userId } });
    if (!appSettings) {
      await this.prisma.appSettings.create({
        data: {
          themePreference: dto.themePreference ?? 'system',
          user: { connect: { id: userId } },
          onboarded: dto.onboarded ?? false,
        },
      });
      return;
    }
    const data: any = {};
    if (dto.themePreference !== undefined) data.themePreference = dto.themePreference;
    if (dto.onboarded !== undefined) data.onboarded = dto.onboarded;
    if (Object.keys(data).length > 0) {
      await this.prisma.appSettings.update({ where: { userId }, data });
    }
  }

  /**
   * Delete app settings for a user
   * @param command - The command containing the user ID whose settings should be removed
   */
  async remove(userId: string) {
    return this.prisma.appSettings.delete({ where: { userId } });
  }
}
