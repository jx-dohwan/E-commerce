import { DynamicModule } from '@nestjs/common';
import {
  TypeOrmModule as OrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import * as path from 'path';
import { DataSourceOptions, DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';

export class TypeOrmModule {
  private static instance?: DynamicModule;

  static forRoot(): DynamicModule {
    if (!this.instance) {
      initializeTransactionalContext();

      this.instance = OrmModule.forRootAsync({
        useFactory: async (
        ): Promise<TypeOrmModuleOptions> => {

          const options: DataSourceOptions = {
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            database: 'e-commerce',
            username: 'test',
            password: 'test',
            entities: [Category, Product],
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: true, // 테스트용 새로 다시 만들기 때문에 실제 서버에서는 사용하면 안됨
            logging: false,
          };

          return options;
        },

        // 여기에 발생하는 에러가 있음 방어를 할 수 있어야함 
        async dataSourceFactory(options?: DataSourceOptions) {
            if (!options) throw new Error('Invalid options passed');
          
            const dataSource = new DataSource(options);
          
            // 이미 같은 이름의 DataSource가 등록되어 있으면 재사용
            if (!dataSource.isInitialized) {
              await dataSource.initialize();
            }
          
            try {
              return addTransactionalDataSource(dataSource);
            } catch (e) {
              if (e.message.includes('already added')) {
                return dataSource; // 이미 등록된 경우 그냥 반환
              }
              throw e;
            }
          }
          
        // async dataSourceFactory(options?: DataSourceOptions) {
        //   if (!options) throw new Error('Invalid options passed');

        //   return addTransactionalDataSource(new DataSource(options));
        // },
      });
    }

    return this.instance;
  }
}