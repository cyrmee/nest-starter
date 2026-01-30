import { Global, Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppSettingsModule } from '../app-settings/app-settings.module';
import { CommonModule } from '../common/common.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Global()
@Module({
  imports: [
    PrismaModule,
    RedisModule,
    ConfigModule,
    forwardRef(() => AppSettingsModule),
    CommonModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
          throw new Error('JWT_SECRET environment variable is not defined');
        }

        const jwtAccessExpiration = configService.get<string>(
          'JWT_ACCESS_EXPIRATION',
        );
        if (!jwtAccessExpiration) {
          throw new Error(
            'JWT_ACCESS_EXPIRATION environment variable is not defined',
          );
        }

        const parseExpiryToSeconds = (expiry: string): number => {
          const defaultExpiry = 15 * 60;
          if (!expiry) return defaultExpiry;
          try {
            const unit = expiry.slice(-1);
            const value = parseInt(expiry.slice(0, -1), 10);
            if (isNaN(value)) return defaultExpiry;
            switch (unit) {
              case 's':
                return value;
              case 'm':
                return value * 60;
              case 'h':
                return value * 60 * 60;
              case 'd':
                return value * 24 * 60 * 60;
              default:
                return defaultExpiry;
            }
          } catch (error) {
            return defaultExpiry;
          }
        };

        const jwtAccessExpirationSeconds = parseExpiryToSeconds(jwtAccessExpiration);

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtAccessExpirationSeconds,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
