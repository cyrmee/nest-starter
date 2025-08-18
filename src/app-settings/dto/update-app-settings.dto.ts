import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@Exclude()
export class UpdateAppSettingsDto {
  @ApiProperty({
    description: 'Theme preference for the application',
    example: 'system',
  })
  @Expose()
  @IsOptional()
  @IsString()
  themePreference?: string;

  @ApiProperty({
    description: 'Indicates whether the user has completed onboarding',
    example: true,
  })
  @Expose()
  @IsOptional()
  @IsBoolean()
  onboarded?: boolean;
}
