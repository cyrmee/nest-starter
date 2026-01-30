import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { AppSettingsService } from './app-settings.service';
import { CreateAppSettingsDto } from './dto/create-app-settings.dto';
import { UpdateAppSettingsDto } from './dto/update-app-settings.dto';

@ApiTags('app-settings')
@Controller('app-settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get app settings for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: "Returns the user's app settings",
    // Using query result as return type
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'App settings not found' })
  async getAppSettings(@Request() req) {
    const userId = req.user.id;
    const settings = await this.appSettingsService.getAppSettings(userId);
    if (!settings) {
      const defaults: CreateAppSettingsDto = {
        themePreference: 'system',
      };
      await this.appSettingsService.create(userId, defaults);
      return await this.appSettingsService.getAppSettings(userId);
    }
    return settings;
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update app settings for the authenticated user' })
  @ApiResponse({
    status: 204,
    description: 'App settings updated successfully',
  })
  @ApiBody({
    type: UpdateAppSettingsDto,
    description: 'Partial app settings to update',
  })
  async update(@Body() dto: UpdateAppSettingsDto, @Request() req) {
    await this.appSettingsService.update(req.user.id, dto);
    return { message: 'App settings updated successfully' };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset app settings for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'App settings reset successfully',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'App settings not found' })
  async remove(@Request() req) {
    const userId = req.user.id;
    await this.appSettingsService.remove(userId);
    const defaults: CreateAppSettingsDto = {
      themePreference: 'system',
    };
    await this.appSettingsService.create(userId, defaults);
    return { message: 'App settings reset successfully' };
  }
}
