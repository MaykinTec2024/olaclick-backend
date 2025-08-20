import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigModule } from './database/sequelize.module';
import { OrdersModule } from './orders/orders.module';
import { CacheConfigModule } from './config/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SequelizeConfigModule,
    CacheConfigModule,  
    OrdersModule,
  ],
})
export class AppModule {}
