import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './app.config';

@Module({
  imports: [ ConfigModule.forRoot({isGlobal: true, load: [dbConfig]}), UserModule, OrganizationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
