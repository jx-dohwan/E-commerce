import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Configurations, DBConfig, JwtConfig, MySqlDBConfig, RedisConfig } from 'src/constants/config';


@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<Configurations>) {}

  getAppConfig(): AppConfig {
    return this.configService.getOrThrow('APP');
  }

  getDBConfig(): DBConfig {
    return this.configService.getOrThrow('DB')
  }

  getMySqlDBConfig(): MySqlDBConfig {
    return this.configService.getOrThrow('MYSQL');
  }

  getRedisConfig(): RedisConfig {
    return this.configService.getOrThrow('REDIS');
  }

  getJwtConfig(): JwtConfig {
    return this.configService.getOrThrow('JWT')
  }

}
