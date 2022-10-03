import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [UserModule, OrganizationModule],
  controllers: [OrganizationController],
  providers: [],
})
export class AppModule {}
