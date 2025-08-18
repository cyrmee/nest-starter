import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../common/crypto.service';
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
        preferredCurrency: true,
        hideAmounts: true,
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
        preferredCurrency: dto.preferredCurrency ?? 'ETB',
        hideAmounts: dto.hideAmounts ?? true,
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
          preferredCurrency: dto.preferredCurrency ?? 'ETB',
          hideAmounts: dto.hideAmounts ?? true,
          themePreference: dto.themePreference ?? 'system',
          user: { connect: { id: userId } },
          onboarded: dto.onboarded ?? false,
          geminiApiKey: dto.geminiApiKey ? await this.cryptoService.encrypt(dto.geminiApiKey) : null,
        },
      });
      return;
    }
    const data: any = {};
    if (dto.preferredCurrency !== undefined) data.preferredCurrency = dto.preferredCurrency;
    if (dto.hideAmounts !== undefined) data.hideAmounts = dto.hideAmounts;
    if (dto.themePreference !== undefined) data.themePreference = dto.themePreference;
    if (dto.onboarded !== undefined) data.onboarded = dto.onboarded;
    if (dto.geminiApiKey !== undefined)
      data.geminiApiKey = dto.geminiApiKey ? await this.cryptoService.encrypt(dto.geminiApiKey) : null;
    if (Object.keys(data).length > 0) {
      await this.prisma.appSettings.update({ where: { userId }, data });
    }
  }

  /**
   * Get user's Gemini API key (decrypted)
   * @returns The decrypted API key or null if not set
   */
  async getGeminiApiKey(userId: string): Promise<string | null> {
    const settings = await this.prisma.appSettings.findUnique({ where: { userId }, select: { geminiApiKey: true } });
    if (!settings?.geminiApiKey) return null;
    return this.cryptoService.decrypt(settings.geminiApiKey);
  }

  /**
   * Delete app settings for a user
   * @param command - The command containing the user ID whose settings should be removed
   */
  async remove(userId: string) {
    return this.prisma.appSettings.delete({ where: { userId } });
  }
}
