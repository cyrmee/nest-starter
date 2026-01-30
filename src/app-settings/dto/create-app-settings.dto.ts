import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateAppSettingsDto {
  @ApiProperty({
    description: 'Theme preference for the application',
    example: 'system',
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  themePreference: string = 'system';
}
